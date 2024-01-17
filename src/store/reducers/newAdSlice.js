import { createSlice } from '@reduxjs/toolkit';
import { EditorState, convertToRaw } from 'draft-js';

export const slice = createSlice({
	name: 'newAd',
	initialState: {
		image: '',
		rawContentState: convertToRaw(EditorState.createEmpty().getCurrentContent()),
		inputs:
		{
			position: {
				value: '',
			},
			positionMarker: {
				value: '',
			},
			minSalary: {
				value: '',
			},
			maxSalary: {
				value: '',
			},
			city: {
				value: '',
			},
			street: {
				value: '',
			},
			voivodeship: {
				value: '',
			},
			companyName: {
				value: '',
			},
			agreementType: {
				value: '',
			},
			workPlace: {
				value: '',
			},
			interviewPlace: {
				value: '',
			},
			contact: {
				value: '',
			}
		}
	},
	reducers: {
		// state can be mutable here, because of Immer.js
		setImage: (state, action) => {
			state.image = action.payload
		},
		setRawContentState: (state, action) => {
			state.rawContentState = action.payload
		},
		setInputs: (state, action) => {
			const { name, value } = action.payload;
			state.inputs[name].value = value;
		}
	}
});

// export actions for dispatch(setImage)
export const { setImage, setRawContentState, setInputs } = slice.actions;

// for useSelector(selectImage) instead useSelector(state => state.newAd.image);
export const selectImage = state => state.newAd.image;
export const selectRawContentState = state => state.newAd.rawContentState;
export const selectInputs = state => state.newAd.inputs;

export default slice.reducer;
