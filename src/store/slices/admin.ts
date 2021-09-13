import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AdminService from '../../services/admin';
import AppErrorHandler from '../../plugins/AppErrorHandler';
import { parseTrustedFields } from '../../tools';

const CREATE_FIELDS = ['nome', 'email', 'senha', 'funcoes_id'];
const UPDATE_FIELDS = ['nome', 'email', 'senha', 'funcoes_id'];

type AdminState = {
    items: any[];
    error: any;
    creating: boolean;
    updating: boolean;
    getting: boolean;
    removing: boolean;
    pagination: {
        page: number;
        qty: number;
        last: number;
    };
    order: 'alfabetica' | 'alfabetica-desc';
};

const initialState: AdminState = {
    items: [],
    error: null,
    creating: false,
    updating: false,
    getting: false,
    removing: false,
    pagination: {
        page: 1,
        qty: 25,
        last: 1,
    },
    order: 'alfabetica',
};

export const getAll = createAsyncThunk('admin/getAll', async (payload: undefined, thunkAPI: any) => {
    try {
        const { pagination, order } = thunkAPI.getState().admin;
        const { data } = await AdminService.getAll(pagination.page, pagination.qty, order);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(AppErrorHandler.getFormattedError(e));
    }
});

export const search = createAsyncThunk('admin/search', async (term: string, thunkAPI: any) => {
    try {
        const { pagination, order } = thunkAPI.getState().admin;
        const { data } = await AdminService.search(term, pagination.page, pagination.qty, order);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(AppErrorHandler.getFormattedError(e));
    }
});

export const create = createAsyncThunk('admin/create', async (payload: any, thunkAPI: any) => {
    try {
        const createPayload = parseTrustedFields(CREATE_FIELDS, payload);
        const { data } = await AdminService.create(createPayload);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(AppErrorHandler.getFormattedError(e));
    }
});

export const update = createAsyncThunk('admin/update', async (payload: any, thunkAPI: any) => {
    try {
        const { id } = payload;
        const updatePayload = parseTrustedFields(UPDATE_FIELDS, payload);
        const { data } = await AdminService.update(id, updatePayload);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(AppErrorHandler.getFormattedError(e));
    }
});

export const remove = createAsyncThunk('admin/remove', async (id: string | number, thunkAPI: any) => {
    try {
        const res = await AdminService.remove(id);
        return id;
    } catch (e) {
        return thunkAPI.rejectWithValue(AppErrorHandler.getFormattedError(e));
    }
});

export const slice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        setQty: (state, action) => {
            state.pagination.qty = action.payload;
        },
        setOrder: (state, action) => {
            state.order = action.payload;
        },
        clearErrors: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // GETALL
            .addCase(getAll.pending, (state) => {
                state.getting = true;
                state.error = null;
            })
            .addCase(getAll.fulfilled, (state, action: PayloadAction<any>) => {
                state.getting = false;
                const { data, meta } = action.payload;
                state.items = data;
                state.pagination = {
                    page: meta.current_page,
                    qty: meta.per_page,
                    last: meta.last_page,
                };
            })
            .addCase(getAll.rejected, (state, action: PayloadAction<any>) => {
                state.getting = false;
                state.error = action.payload;
            })
            // SEARCH
            .addCase(search.pending, (state) => {
                state.getting = true;
                state.error = null;
            })
            .addCase(search.fulfilled, (state, action: PayloadAction<any>) => {
                state.getting = false;
                state.items = action.payload.data;
            })
            .addCase(search.rejected, (state, action: PayloadAction<any>) => {
                state.getting = false;
                state.error = action.payload;
            })
            // CREATE
            .addCase(create.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(create.fulfilled, (state, action: PayloadAction<any>) => {
                state.creating = false;
                state.items.splice(0, 0, action.payload);
            })
            .addCase(create.rejected, (state, action: PayloadAction<any>) => {
                state.creating = false;
                state.error = action.payload;
            })
            // UPDATE
            .addCase(update.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(update.fulfilled, (state, action: PayloadAction<any>) => {
                state.updating = false;
                const { data } = action.payload;
                const INDEX = state.items.findIndex((e) => e.id === data.id);
                state.items.splice(INDEX, 1, data);
            })
            .addCase(update.rejected, (state, action: PayloadAction<any>) => {
                state.updating = false;
                state.error = action.payload;
            })
            // REMOVE
            .addCase(remove.pending, (state) => {
                state.removing = true;
                state.error = null;
            })
            .addCase(remove.fulfilled, (state, action: PayloadAction<number | string>) => {
                state.removing = false;
                state.items = state.items.filter((e) => e.id !== action.payload);
            })
            .addCase(remove.rejected, (state, action: PayloadAction<any>) => {
                state.removing = false;
                state.error = action.payload;
            });
    },
});

export const { setPage, setQty, setOrder, clearErrors } = slice.actions;

export default slice.reducer;
