<template>
	<view>
		<view class="cu-chat">
			<!-- 右边 -->
			<view class="cu-item" :class="item.iden==1?'self':''" v-for="(item,index) in chat_data" :key="index">
				<view class="cu-avatar radius" v-if="item.iden==2" @click="user_friend(item.user_id)" :style="{'background-image':'url('+item.user_head+')'}"></view>
				<view class="main">
					<block v-if="item.type==2">
						<image :src="item.chat_con" @click="previewImg(item.chat_con)"></image>
					</block>
					<block v-else>
						<view class="user_name" v-if="item.iden==2">{{item.user_name}}</view>
						<view class="content shadow" :class="item.iden==1?'bg-green':''">
							<text style="word-break:break-all;">{{item.chat_con}}</text>
						</view>
					</block>
					
				</view>
				<view class="cu-avatar radius" v-if="item.iden==1" @click="user_friend(item.user_id)" :style="{'background-image':'url('+item.user_head+')'}"></view>
				<view class="date">{{item.add_time}}</view>
			</view>
			
			<!-- 中间 -->
			<!-- <view class="cu-item cu-info">对方撤回一条消息!</view> -->
			<!-- 左边 -->
			<!-- <view class="cu-item">
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view>
				<view class="main">
					<view class="content shadow">
						<text>喵喵喵！喵喵喵！</text>
					</view>
				</view>
				<view class="date "> 13:23</view>
			</view> -->
<!-- 			图片
			<view class="cu-item self">
				<view class="main">
					<image src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg" class="radius" mode="widthFix"></image>
				</view>
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
				<view class="date"> 13:23</view>
			</view> -->
		</view>


		<!-- 输入框 -->
		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view class="action">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
			 @focus="InputFocus" @blur="InputBlur" v-model="chat_conten"></input>
			 <!-- <textarea v-model="chat_conten" placeholder="" /> -->
			<view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button :disabled="chat_conten.length==0" :class="chat_conten.length==0?'bg-black':''" class="cu-btn bg-green shadow" @click="send">发送</button>
		</view>

	</view>
</template>

<script>
	const apps=getApp().globalData.comm;
	export default {
		data() {
			return {
				InputBottom: 0,
				id:0,
				max_id:0,
				title:'',
				chat_data:[],
				page:1,
				chat_conten:'',
				user_data:[],
				timeval:0,
			};
		},
		onPullDownRefresh() { // 下拉刷新事件
			var that=this;
			that.page++;
			setTimeout(function () {
				that.chat_con(1,that.page);
			}, 1000);
		},
		onLoad(e) {
			this.id=e.id
			uni.setNavigationBarTitle({
				title:e.title
			});
			this.chat_con(1,this.page)
			var that=this;
			this.timeval=setInterval(()=>{
				that.chat_con(2,1)
			},10000)
		},
		onBackPress(){//退出当前页面，停止轮询器
			clearInterval(this.timeval)
		},
		methods: {
			send(){
				if(this.chat_conten.length<0)return;
				let user_info=this.user_data;
				let con={
					add_time: '',
					chat_con: this.chat_conten,
					iden: 1,
					type: null,
					user_id: user_info.id,
					user_head: user_info.user_head
				}
				this.chat_data.push(con)
				this.chat_conten='';
				setTimeout(() => {
				   uni.pageScrollTo({scrollTop: 99999, duration: 0});
				}, 50);
			},
			InputFocus(e) {
				console.log(e)
				this.InputBottom = e.detail.height;
			},
			InputBlur(e) {
				console.log(e)
				this.InputBottom = 0;
			},
			user_friend(id){
				uni.navigateTo({
					url:'../user/user_friend?id='+id
				})
			},
			chat_con(judge,page){
				this.$request(apps.api.chat_con,{room_id:this.id,page:page,max_id:this.max_id}).then(res=>{
					if(res.code==200){
						uni.stopPullDownRefresh();
						var i=0;
						if(res.data.max_id){
							this.max_id=res.data.max_id;
						}
						if(judge==2){
							for(i in res.data.data){
								this.chat_data.push(res.data.data[i]);
							}
						}else{
							for(i in res.data.data){
								this.chat_data.unshift(res.data.data[i]);
							}
						}
						this.user_data=res.data.user;
						if(res.data.data.length>0){
							setTimeout(() => {
							   uni.pageScrollTo({scrollTop: 99999, duration: 0});
							}, 50);
						}
					}
					
				})
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
	@import "../../static/css/main.css";
	.cu-chat .cu-item>.main{
		flex-wrap: wrap;
		.content{
			width: 100%;
		}
		.user_name{
			margin: 0 10rpx 5rpx 10rpx;
			color: #989595;
		}
	}
	page{
	  padding-bottom: 100rpx;
	  background-color: #ece8e878;
	  min-height: 100%;
	}
	.bg-black{
		color: black!important;
		background-color: #ccc!important;
	}
</style>