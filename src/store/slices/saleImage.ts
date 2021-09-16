import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import ImageService from '../../services/saleImage';
import { parseTrustedFields } from '../../tools';

const UPDATE_FIELDS = ['capa', 'perfil'];

type SaleImageState = {
    items: any[];
    error: any;
    uploading: boolean;
    updating: boolean;
    getting: boolean;
    removing: boolean;
    order: 'alfabetica' | 'alfabetica-desc';
};

const initialState: SaleImageState = {
    items: [],
    error: null,
    uploading: false,
    updating: false,
    getting: false,
    removing: false,
    order: 'alfabetica',
};

export const getAllBySale = createAsyncThunk('saleImage/getAllBySale', async (id: number | string, thunkAPI: any) => {
    try {
        const { data } = await ImageService.getAllBySale(id);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response && e.response.data ? e.response.data : e);
    }
});

export const upload = createAsyncThunk('saleImage/upload', async (payload: any, thunkAPI: any) => {
    try {
        const { id, file } = payload;
        const { data } = await ImageService.upload(id, file);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response && e.response.data ? e.response.data : e);
    }
});

export const update = createAsyncThunk('saleImage/update', async (payload: any, thunkAPI: any) => {
    try {
        const { id } = payload;
        const updatePayload = parseTrustedFields(UPDATE_FIELDS, payload);
        const { data } = await ImageService.update(id, updatePayload);
        return data;
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response && e.response.data ? e.response.data : e);
    }
});

export const remove = createAsyncThunk('saleImage/remove', async (id: string | number, thunkAPI: any) => {
    try {
        const res = await ImageService.remove(id);
        return id;
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response && e.response.data ? e.response.data : e);
    }
});

export const slice = createSlice({
    name: 'saleImage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // GETALL
            .addCase(getAllBySale.pending, (state) => {
                state.getting = true;
                state.error = null;
                state.items = [];
            })
            .addCase(getAllBySale.fulfilled, (state, action: PayloadAction<any>) => {
                state.getting = false;
                state.items = action.payload;
            })
            .addCase(getAllBySale.rejected, (state, action: PayloadAction<any>) => {
                state.getting = false;
                state.error = action.payload.error;
            })
            // UPLOAD
            .addCase(upload.pending, (state) => {
                state.uploading = true;
                state.error = null;
            })
            .addCase(upload.fulfilled, (state, action: PayloadAction<any>) => {
                console.log('UPLOAD OK', action.payload);
                state.uploading = false;
                state.items.splice(0, 0, action.payload);
            })
            .addCase(upload.rejected, (state, action: PayloadAction<any>) => {
                console.log('UPLOAD FAIL', action.payload);
                state.uploading = false;
                state.error = action.payload.error;
            })
            // UPDATE
            .addCase(update.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(update.fulfilled, (state, action: PayloadAction<any>) => {
                state.updating = false;
                const isProfile = action.payload.perfil;
                const isCover = action.payload.capa;
                if (isProfile) {
                    state.items.map((image: any, i: number) => {
                        if (image.perfil) {
                            state.items[i].perfil = false;
                        }
                    });
                }
                if (isCover) {
                    state.items.map((image: any, i: number) => {
                        if (image.capa) {
                            state.items[i].capa = false;
                        }
                    });
                }
                const INDEX = state.items.findIndex((e) => e.id === action.payload.id);
                state.items.splice(INDEX, 1, action.payload);
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

// export const { setPage, setQty, setOrder } = slice.actions;

export default slice.reducer;
