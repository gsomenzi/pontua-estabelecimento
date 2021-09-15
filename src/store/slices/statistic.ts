import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import StatisticService from '../../services/statistic';

type StatisticState = {
    loading: boolean;
    data: StatisticData | null;
    establishmentData: EstablishmentStatisticData | null;
    productData: any;
    error: any;
};

const initialState: StatisticState = {
    data: null,
    establishmentData: null,
    productData: null,
    error: null,
    loading: false,
};

export const getAll = createAsyncThunk('statistic/getAll', async (payload: undefined, { rejectWithValue }) => {
    try {
        const { data } = await StatisticService.getAll();
        return data;
    } catch (e) {
        return rejectWithValue(e.response && e.response.data ? e.response.data : e);
    }
});

export const getByProduct = createAsyncThunk(
    'statistic/getByProduct',
    async (id: number | string, { rejectWithValue }) => {
        try {
            const { data } = await StatisticService.getByProduct(id);
            return data;
        } catch (e) {
            return rejectWithValue(e.response && e.response.data ? e.response.data : e);
        }
    }
);

export const slice = createSlice({
    name: 'statistic',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // GETALL
            .addCase(getAll.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAll.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getAll.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            // GETBYPRODUCT
            .addCase(getByProduct.pending, (state) => {
                state.loading = true;
                state.productData = null;
                state.error = null;
            })
            .addCase(getByProduct.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.productData = action.payload;
            })
            .addCase(getByProduct.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload.error;
            });
    },
});

// export const { getLocalAccessToken, signOut } = slice.actions;

export default slice.reducer;
