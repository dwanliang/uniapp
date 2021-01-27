<template>
	<view>
		<u-navbar style="background-color: white;" :is-back="false" title="　" :border-bottom="false">
			<view class="u-flex u-row-right" style="width: 100%;">
				<view class="camera u-flex u-row-center">
					<u-icon name="camera-fill" color="#000000" size="48"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30" @click="goLogin">
			<view class="u-m-r-10">
				<u-avatar @click="previewImg(userInfo.user_head)" :src="userInfo.user_head" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{userInfo.user_name}}</view>
			</view>
		</view>
		<view class="u-m-t-20">
			<view class="jia_friend" @click="user_go(userInfo.friend_where)">
				<blcok v-if="userInfo.friend_where">
					发消息
				</blcok>
				<block v-else>
					加为好友
				</block>
			</view>
		</view>
	</view>
	
</template>

<script>
	const apps=getApp().globalData.comm;
	export default{
		data(){
			return{
				id:0,
				userInfo:[],
			}
		},
		onLoad(e) {
			this.id=e.id
			this.user_lsit(this.id)
		},
		methods:{
			user_lsit(id){
				this.$request(apps.api.user_list,{user_id:id}).then(res=>{
					if(res.code==200){
						this.userInfo=res.data
					}
				})
			},
			user_go(where){
				if(where){
					this.$request(apps.api.chat_where,{user_id:this.id}).then(res=>{
						uni.navigateTo({
							url:'../chatroom/index?id='+res+'&title='+this.userInfo.user_name
						})
					})
				}else{
					this.$request(apps.api.user_new_add,{user_id:this.id}).then(res=>{
						if(res.code==200){
							apps.tan('已发送好友申请',1000)
						}
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
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #ece8e878;
	}
	.user-box{
		background-color: white;
	}
	.jia_friend{
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx;
		background-color: white;
		color: #99bbff;
	}
</style>
