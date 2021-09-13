import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserService from '../../services/user';

type UserState = {
    item: any;
    items: any[];
    error: any;
    getting: boolean;
    removing: boolean;
    pagination: {
        page: number;
        qty: number;
        last: number;
    };
    order:
        | 'alfabetica'
        | 'alfabetica-desc'
        | 'escolaridade'
        | 'escolaridade-desc'
        | 'sexo'
        | 'sexo-desc'
        | 'data_nascimento'
        | 'data_nascimento-desc'
        | 'pontos'
        | 'pontos-desc'
        | 'vezes'
        | 'vezes-desc';
    filters: any;
};

const initialState: UserState = {
    item: null,
    items: [],
    error: null,
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

export const getAll = createAsyncThunk('user/getAll', async (payload: undefined, thunkAPI: any) => {
    try {
        const { pagination, order, filters } = thunkAPI.getState().user;
        const { data } = await UserService.getAll(pagination.page, pagination.qty, order, filters);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response && e.response.data ? e.response.data : e);
    }
});

export const search = createAsyncThunk('user/search', async (term: string, thunkAPI: any) => {
    try {
        const { pagination, order } = thunkAPI.getState().user;
        const { data } = await UserService.search(term, pagination.page, pagination.qty, order);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response && e.response.data ? e.response.data : e);
    }
});

export const getOne = createAsyncThunk('user/getOne', async (id: number | string, thunkAPI: any) => {
    try {
        const { data } = await UserService.getOne(id);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response && e.response.data ? e.response.data : e);
    }
});

export const remove = createAsyncThunk('user/remove', async (id: string | number, thunkAPI: any) => {
    try {
        const res = await UserService.remove(id);
        return id;
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response && e.response.data ? e.response.data : e);
    }
});

export const slice = createSlice({
    name: 'user',
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
            // GETONE
            .addCase(getOne.pending, (state) => {
                state.item = null;
                state.getting = true;
                state.error = null;
            })
            .addCase(getOne.fulfilled, (state, action: PayloadAction<any>) => {
                state.getting = false;
                const { data } = action.payload;
                state.item = data;
            })
            .addCase(getOne.rejected, (state, action: PayloadAction<any>) => {
                state.getting = false;
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

export const { setPage, setQty, setOrder, setFilters } = slice.actions;

export default slice.reducer;
