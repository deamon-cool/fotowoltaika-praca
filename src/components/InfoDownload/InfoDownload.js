import React from 'react';

import modifyFetchUrl from '../../functions/modifyFetchUrl';
import * as text from '../../text/text';
import Button from '../Button/Button';
import Information from '../Information/Information';

function InfoDownload(props) {

	const downloadHandler = (url, fileName) => {
		const modifiedUrl = modifyFetchUrl(url);
		const init = {
			method: 'GET'
		};

		fetch(modifiedUrl, init)
			.then(res => res.blob())
			.then(blob => {
				let urlObj = window.URL.createObjectURL(blob);
				let a = document.createElement('a');
				a.href = urlObj;
				a.download = fileName;
				a.click();
			})
			.catch(e => {
				console.log(text.CATCH_ERROR_FETCH);
			});
	};

	return (
		<Information
			title={props.title}
			customStyle={{ marginTop: props.marginTop }} >
			<Button
				customStyle={{width: '200px'}}
				clickHandler={() => downloadHandler(props.downloadUrl, props.fileName)}>
				{props.downloadButtonName}
			</Button>
		</Information>
	);
}

export default InfoDownload;