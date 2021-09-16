import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import SaleService from '../../services/sale';
import { parseTrustedFields } from '../../tools';
import AppErrorHandler from '../../plugins/AppErrorHandler';

const CREATE_FIELDS = ['nome', 'descricao', 'inicio_validade', 'final_validade', 'ativo', 'estabelecimentos_id'];
const UPDATE_FIELDS = ['nome', 'descricao', 'inicio_validade', 'final_validade', 'estabelecimentos_id'];

type SaleState = {
    items: any[];
    item: any;
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
    filters: any;
};

const initialState: SaleState = {
    items: [],
    item: null,
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
    filters: null,
};

export const getAll = createAsyncThunk('sale/getAll', async (payload: undefined, thunkAPI: any) => {
    try {
        const { pagination, order, filters } = thunkAPI.getState().product;
        console.log(pagination, order, filters);
        const { data } = await SaleService.getAll(pagination.page, pagination.qty, order, filters);
        console.log(data);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response && e.response.data ? e.response.data : e);
    }
});

export const search = createAsyncThunk('sale/search', async (term: string, thunkAPI: any) => {
    try {
        const { pagination, order } = thunkAPI.getState().user;
        const { data } = await SaleService.search(term, pagination.page, pagination.qty, order);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response && e.response.data ? e.response.data : e);
    }
});

export const getOne = createAsyncThunk('sale/getOne', async (id: number | string, thunkAPI: any) => {
    try {
        const { data } = await SaleService.getOne(id);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(AppErrorHandler.getFormattedError(e));
    }
});

export const create = createAsyncThunk('sale/create', async (payload: any, thunkAPI: any) => {
    try {
        const createPayload = parseTrustedFields(CREATE_FIELDS, payload);
        const { data } = await SaleService.create(createPayload);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(AppErrorHandler.getFormattedError(e));
    }
});

export const update = createAsyncThunk('sale/update', async (payload: any, thunkAPI: any) => {
    try {
        const { id } = payload;
        const updatePayload = parseTrustedFields(UPDATE_FIELDS, payload);
        const { data } = await SaleService.update(id, updatePayload);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(AppErrorHandler.getFormattedError(e));
    }
});

export const remove = createAsyncThunk('sale/remove', async (id: string | number, thunkAPI: any) => {
    try {
        const res = await SaleService.remove(id);
        return id;
    } catch (e) {
        return thunkAPI.rejectWithValue(AppErrorHandler.getFormattedError(e));
    }
});

export const slice = createSlice({
    name: 'sale',
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
        setItemProfile: (state, action) => {
            state.item.perfil = action.payload;
        },
        setItemCover: (state, action) => {
            state.item.capa = action.payload;
        },
        clearErrors: (state) => {
            state.error = null;
        },
        setFilters: (state, action) => {
            state.filters = action.payload;
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
                state.error = action.payload.error;
            })
            // GETONE
            .addCase(getOne.pending, (state) => {
                state.item = null;
                state.getting = true;
                state.error = null;
            })
            .addCase(getOne.fulfilled, (state, action: PayloadAction<any>) => {
                state.getting = false;
                console.log(action.payload.data);
                const { data } = action.payload;
                state.item = data;
            })
            .addCase(getOne.rejected, (state, action: PayloadAction<any>) => {
                state.getting = false;
                state.error = action.payload.error;
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
                state.error = action.payload.error;
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
                state.error = action.payload.error;
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
                state.error = action.payload.error;
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
                state.error = action.payload.error;
            });
    },
});

export const { setPage, setQty, setOrder, setItemProfile, setItemCover, clearErrors, setFilters } = slice.actions;

export default slice.reducer;
