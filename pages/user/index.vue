<template>
	<view class="u-m-t-20">
		<u-cell-group>
			<u-cell-item icon="photo"  @click="upload" title="头像"><image class="logo-img" :src="uerInfo.user_head"></image></u-cell-item>
			<u-cell-item icon="account-fill"  @click="show('user','用户名',uerInfo.user_name)" title="用户名"><text class="text_right">{{uerInfo.user_name}}</text></u-cell-item>
			<u-cell-item icon="info" @click="fuzhi(uerInfo.only_id)" title="唯一ID"><text class="text_right">{{uerInfo.only_id}}</text></u-cell-item>
			<u-cell-item icon="edit-pen-fill"  @click="show('pass','修改密码')" title="修改密码"></u-cell-item>
		</u-cell-group>
		<view class="login">
			<prompt ref="prompt" @onConfirm="onConfirm" @onCancel="onCancel" @submit="submit" title="提示"></prompt>
		</view>
		<button type="warn" class="submit" @click="ougin">
			退出
		</button>
	</view>
	<!-- <view class="center">
		<view class="center-list">
			<view class="center-list-item border-bottom" @click="upload">
				<text class="list-icon">&#xe60f;</text>
				<text class="list-text">头像</text>
				<image class="logo-img" :src="uerInfo.user_head"></image>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item border-bottom" @click="show('user','用户名',uerInfo.user_name)">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">用户名</text>
				<text class="text_right">{{uerInfo.user_name}}</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item border-bottom" @click="fuzhi(uerInfo.only_id)">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">唯一ID</text>
				<text class="text_right">{{uerInfo.only_id}}</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item border-bottom" @click="show('pass','修改密码')">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">修改密码</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="login">
			<prompt ref="prompt" @onConfirm="onConfirm" @onCancel="onCancel" @submit="submit" title="提示"></prompt>
		</view>
		<view class="ougin" @click="ougin">
			退出
		</view>
	</view> -->
</template>

<script>
	const apps=getApp().globalData.comm;
	import prompt from '../../components/popup/popup.vue';
	export default {
		components: {
			prompt,
		},
		data() {
			return {
				login: false,
				avatarUrl: "../../static/uni-center/logo.png",
				uerInfo: {
					
				},
				login_type:''
			}
		},
		onLoad() {
			this.user_list()
		},
		methods: {
			user_list(){
				var data={}
				this.$request(apps.api.user_list,data).then(res => {
					if(res.code==200){
						this.uerInfo=res.data;
					}
				})
			},
			show: function(type,title,value) {
				this.$refs.prompt.isHidden = !this.$refs.prompt.isHidden;
				this.$refs.prompt.type=type;
				this.$refs.prompt.title=title;
				this.$refs.prompt.value=value;
			},
			submit(val){
				let value=val.value;
				let type=val.type;
				if(type=='user'){
					this.user_edit(value,type)
				}else if(type=='pass'){
					this.pass_reset(value)
				}
			},
			user_edit(value,type){
				if(value==this.uerInfo.user_name){
					return;
				}
				var data={data:value,type:type}
				this.$request(apps.api.user_edit,data).then(res => {
					if(res.code==200){
						apps.tan(res.msg,1000)
						this.user_list();
					}else if(res.code==0){
						apps.tan(res.msg,1000)
					}
				})
			},
			pass_reset(value){
				let passwords=value.passwords;//旧密码
				let password=value.password;//新密码
				var data={passwords:passwords,password:password}
				this.$request(apps.api.pass_reset,data).then(res => {
					apps.tan(res.msg,1000)
				})
			},
			previewImg(logourl) {
				console.log(logourl)
				let _this = this;
				let imgsArray = [];
				imgsArray[0] = logourl
				uni.previewImage({
					current: 0,
					urls: imgsArray
				});
			},
			fuzhi(data){
				uni.setClipboardData({
				    data:data,
				    success: function () {
				        console.log('复制成功');
				    }
				});
			},
			upload : function(){
				let _self = this;
				const url = apps.baseUrl+apps.api.user_head;
				uni.chooseImage({
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
				        const uploadTask = uni.uploadFile({
				            url: url, 
				            filePath: tempFilePaths[0],
				            name: 'file',
				            formData: {
				                'uid':apps.user_id
				            },
				            success: (res) => {
								var data = JSON.parse(res.data);
				                apps.tan(data.msg,2000)
								_self.user_list()
				            }
				        });
				    }
				});
			},
			ougin(){
				uni.showModal({
				    title: '是否退出当前账号',
				    success: function (res) {
				        if (res.confirm) {
				            uni.removeStorageSync('input_info')
							// #ifdef MP-WEIXIN
							uni.reLaunch({
								url:'../ge/index'
							})
							// #endif
							// #ifndef MP-WEIXIN
							uni.reLaunch({
								url:'../login/login'
							}) 
							// #endif
				        }
				    }
				});
			},
		}
	}
</script>

<style>
	.logo-img {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		margin-top: 5upx;
		z-index: 9999;
		position: relative;
	}
	
</style>