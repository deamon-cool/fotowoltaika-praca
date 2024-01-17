import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
	name: 'advertiserSession',
	initialState: {
		advertiserID: '',
		entryKey: '',
		idKeys: []
	},
	reducers: {
		// state can be mutable here, because of Immer.js
		setAdvertiserID: (state, action) => {
			state.advertiserID = action.payload;
		},
		setEntryKey: (state, action) => {
			state.entryKey = action.payload;
		},
		setIdKeys: (state, action) => {
			state.idKeys = action.payload;
		}
	}
});

// export actions for dispatch(setImage)
export const { setAdvertiserID, setEntryKey, setIdKeys } = slice.actions;

// for useSelector(selectImage) instead useSelector(state => state.newAd.image);
export const selectAdvertiserID = state => state.advertiserSession.advertiserID;
export const selectEntryKey = state => state.advertiserSession.entryKey;
export const selectIdKeys = state => state.advertiserSession.idKeys;


export default slice.reducer;
