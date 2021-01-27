import md5 from 'js-md5';
import apps from 'commonality/app.js';
 
const baseUrl = apps.baseUrl;

const request = (url = '', date = {}, type = 'GET', header = {
}) => {
	var user_id=uni.getStorageSync('input_info').user_id;
	Object.assign(date,{uid:user_id})
	header=token_md5(date)
    return new Promise((resolve, reject) => {
		if(!user_id && url.indexOf('User')==-1){
			if(url.indexOf('form_list')==-1 && url.indexOf('form_coll')==-1){
				uni.showToast({
					title: '登录状态失效，请重新登录',
					icon: 'none',
					duration:1000,
				})
				setTimeout(()=>{
					uni.reLaunch({
						url:'../ge/index'
					})
				},1000)
				return false;
			}
		}
        uni.request({
            method: type,
            url: baseUrl + url,
            data: date,
            header: header,
            dataType: 'JSON',     
        }).then((response) => {
            // setTimeout(function() {
                uni.hideLoading();
            // }, 1000);
            let [error, res] = response;
			let data=res.data;
			if(typeof data=='string'){
				data=JSON.parse(data)
			}
            resolve(data);
        }).catch(error => {
            let [err, res] = error;
            reject(err)
        })
    });
}
const token_md5=(arr)=>{//请求参数md5加密
	var time=Math.round(new Date()/1000);
	// Object.assign(arr,{'time':time});//对象追加
	var token='';
	for(let key in arr){
		token+=md5(arr[key]+'');
	}
	token+=md5(time+'');
	var header={};
	token='sing-'+md5('dwan_'+token+'_dwan');
	Object.assign(header,{'token':token,'time':time})
	return header;
}
export default request