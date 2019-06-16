const methods = {
	inputError: (item,reg,text) => {
		let status =false;
		let errorText = '';
		if(!reg.test(item)) {
			status = false;
			errorText = text;
		}
		else {
		    status = true;
		    errorText = '';
		}
		return {
			status,
			errorText
		}
	}
}

export {methods};