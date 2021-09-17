import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import ScoreService from '../../services/score';
import { parseTrustedFields } from '../../tools';
import AppErrorHandler from '../../plugins/AppErrorHandler';

const CREATE_FIELDS = ['users_id', 'pontos', 'quantidade', 'mensagem'];

type ScoreState = {
    items: any[];
    item: any;
    error: any;
    creating: boolean;
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

const initialState: ScoreState = {
    items: [],
    item: null,
    error: null,
    creating: false,
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

export const getAll = createAsyncThunk('score/getAll', async (payload: undefined, thunkAPI: any) => {
    try {
        const { pagination, order, filters } = thunkAPI.getState().score;
        const { data } = await ScoreService.getAll(pagination.page, pagination.qty, order, filters);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response && e.response.data ? e.response.data : e);
    }
});

export const create = createAsyncThunk('score/create', async (payload: any, thunkAPI: any) => {
    try {
        const createPayload = parseTrustedFields(CREATE_FIELDS, payload);
        const { data } = await ScoreService.create(createPayload);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(AppErrorHandler.getFormattedError(e));
    }
});

export const remove = createAsyncThunk('score/remove', async (id: string | number, thunkAPI: any) => {
    try {
        const res = await ScoreService.remove(id);
        return id;
    } catch (e) {
        return thunkAPI.rejectWithValue(AppErrorHandler.getFormattedError(e));
    }
});

export const slice = createSlice({
    name: 'score',
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
        setFilters: (state, action) => {
            state.filters = action.payload;
        },
        resetScore: (state) => {
            state.item = null;
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
            // CREATE
            .addCase(create.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(create.fulfilled, (state, action: PayloadAction<any>) => {
                state.creating = false;
                state.item = action.payload;
                state.items.splice(0, 0, action.payload);
            })
            .addCase(create.rejected, (state, action: PayloadAction<any>) => {
                state.creating = false;
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

export const { setPage, setQty, setOrder, clearErrors, setFilters, resetScore } = slice.actions;

export default slice.reducer;
