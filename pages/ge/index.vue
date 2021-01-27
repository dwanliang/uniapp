<template>
	<view>
		<u-navbar :is-back="false" title="　" :border-bottom="false">
			<view class="u-flex u-row-right" style="width: 100%;">
				<view class="camera u-flex u-row-center">
					<u-icon name="camera-fill" color="#000000" size="48"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30" @click="goLogin">
			<view class="u-m-r-10">
				<u-avatar @click="previewImg(login ? uerInfo.user_head :avatarUrl)" :src="login ? uerInfo.user_head :avatarUrl" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">Hi，{{login ? uerInfo.user_name : '您未登录'}}</view>
				<!-- <view class="u-font-14 u-tips-color">微信号:helang_uView</view> -->
			</view>
			<!-- <view class="u-m-l-10 u-p-10">
				<u-icon name="scan" color="#969799" size="28"></u-icon>
			</view> -->
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>
		
<!-- 		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="rmb-circle" title="支付"></u-cell-item>
			</u-cell-group>
		</view>
		 -->
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="coupon-fill" @click="my_form" title="表单中心"></u-cell-item>
				<u-cell-item icon="coupon" title="关于我"></u-cell-item>
				<u-cell-item icon="heart" title="关注"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="设置"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
	<!-- <view class="center">
		<view class="logo" @click="goLogin" :hover-class="!login ? 'logo-hover' : ''">
			<image class="logo-img" @click="previewImg(login ? uerInfo.user_head :avatarUrl)" :src="login ? uerInfo.user_head :avatarUrl"></image>
			<view class="logo-title">
				<text class="uer-name">Hi，{{login ? uerInfo.user_name : '您未登录'}}</text>
				<text class="go-login navigat-arrow" v-if="!login">&#xe65e;</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom" @click="team_list">
				<text class="list-icon">&#xe60f;</text>
				<text class="list-text">我的团队</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" @click="my_form">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">信息收集中心</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">帮助与反馈</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">关于我</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe60b;</text>
				<text class="list-text">帮助与反馈</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
	</view> -->
</template>

<script>
	const apps=getApp().globalData.comm;
	export default {
		data() {
			return {
				login: false,
				avatarUrl: "../../static/uni-center/logo.png",
				uerInfo: {
					
				},
				login_type:''
			}
		},
		onPullDownRefresh() { // 下拉刷新事件
			var that=this;
			if(uni.getStorageSync('input_info')){
				setTimeout(function () {
					that.user_list();
					uni.stopPullDownRefresh()
				}, 1000);
			}else{
				this.login=false;
			}
		},
		// onShow(){//强制更新
		// 	if(uni.getStorageSync('input_info')){
		// 		this.login=true;
		// 		this.user_list();
		// 	}
		// },
		onLoad() {
			if(uni.getStorageSync('input_info')){
				this.login=true;
				this.user_list();
			}
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
			my_form(){
				uni.navigateTo({
					url:'../form/my_form'
				})
			},
			goLogin() {//授权登录
				if (!this.login) {
					// #ifdef MP-WEIXIN
					this.weixinLogin();
					// #endif
					// #ifndef MP-WEIXIN
					uni.navigateTo({
						url:'../login/login'
					})
					// #endif
					
				}else{
					uni.navigateTo({
						url:'../user/index'
					})
				}
			},
			previewImg(logourl) {
				let _this = this;
				let imgsArray = [];
				imgsArray[0] = logourl
				uni.previewImage({
					current: 0,
					urls: imgsArray,
					longPressActions: {
						itemList: ['保存图片'],
						success: function(data) {
						//云函数下载已上传至云开发的文件至临时文件
							uni.downloadFile({
								url: imgsArray[0],
								success: (res) => {
									if (res.statusCode === 200) {
										//保存图片到系统相册
										uni.saveImageToPhotosAlbum({
											filePath: res.tempFilePath,
											success: function() {
												uni.showToast({
													title: "保存成功",
													icon: "none"
												});
												return
											},
											fail: function() {
												uni.showToast({
													title: "保存失败，请稍后重试",
													icon: "none"
												});
												return
											}
										});
									}
								}
							})
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			weixinLogin(){
				let that = this;
				uni.login({
					provider: 'weixin',
					success: function(res) {
						that.get_openid(res.code);
					}
				});
			},
			get_openid(code){
				var that=this;
				var data={code:code};
				this.$request(apps.api.user_wx,data).then(res => {//获取openid
					var openid=res.data;
					//获取用户信息
					uni.getUserInfo({
						provider: 'weixin',
						success: function(res) {
							that.login_type='weixin';
							that.wxzhuce(openid,res.userInfo.nickName)
						}
					});
				})
			},
			wxzhuce(openid,user_name){
				var data={openid:openid,user_name:user_name,type:4};
				this.$request(apps.api.user_add,data).then(res => {
					if(res){
						uni.setStorageSync('input_info', res.data);
						console.log(res.data)
						uni.reLaunch({
							url:'../ge/index',
						})
					}
				})
			},
			
			
		}
	}
</script>


<!-- <style>
	@font-face {
		font-family: texticons;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf') format('truetype');
	}

	page,
	view {
		display: flex;
	}

	page {
		background-color: #f8f8f8;
	}

	.center {
		flex-direction: column;
	}

	.logo {
		width: 750upx;
		height: 240upx;
		padding: 20upx;
		box-sizing: border-box;
		background-color: deepskyblue;
		flex-direction: row;
		align-items: center;
	}

	.logo-hover {
		opacity: 0.8;
	}

	.logo-img {
		width: 150upx;
		height: 150upx;
		border-radius: 150upx;
	}

	.logo-title {
		height: 150upx;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		margin-left: 20upx;
	}

	.uer-name {
		height: 60upx;
		line-height: 60upx;
		font-size: 38upx;
		color: #FFFFFF;
	}

	.go-login.navigat-arrow {
		font-size: 38upx;
		color: #FFFFFF;
	}

	.login-title {
		height: 150upx;
		align-items: self-start;
		justify-content: center;
		flex-direction: column;
		margin-left: 20upx;
	}

	.center-list {
		background-color: #FFFFFF;
		margin-top: 20upx;
		width: 750upx;
		flex-direction: column;
	}

	.center-list-item {
		height: 90upx;
		width: 750upx;
		box-sizing: border-box;
		flex-direction: row;
		padding: 0upx 20upx;
	}

	.border-bottom {
		border-bottom-width: 1upx;
		border-color: #c8c7cc;
		border-bottom-style: solid;
	}

	.list-icon {
		width: 40upx;
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #4cd964;
		text-align: center;
		font-family: texticons;
		margin-right: 20upx;
	}

	.list-text {
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		flex: 1;
		text-align: left;
	}

	.navigat-arrow {
		height: 90upx;
		width: 40upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		text-align: right;
		font-family: texticons;
	}
</style> -->