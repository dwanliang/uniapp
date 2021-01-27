<template>
	
	<view class="cont-1">
		<view class="content">
			<view class="msg-con" v-for="(item,index) in msgdata" :key="index">
				<view class="msg-1">
					<view class="msg-lae">
						<label >{{item.msg_con}}</label>
					</view>
					<!-- <text>{{item.msg_con}}</text> -->
					<view class="time"><text style="float: left;">{{item.user_name}}</text>{{item.msg_time}}</view>
				</view>
			</view>
		</view>
		<view class="all-add" @tap="msg_add(id)" v-if="state<3">
			<image src="../../static/img/jia.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default{
		name:'teammsg',
		props:{
			id: {
				type: [Number],
			},
			msgdata: {
				type: [Array],
				default() {
					return [];
				}
			},
			state: {
				type: [Number],
			},
		},
		mounted(){
			console.log(this.state)
		},
		data() {
			return {
				
			};
		},
		methods:{
			msg_add(id) {
				uni.navigateTo({
					url: '/pages/team/msg_add?id='+id,//添加表团队公告
				});
			},
		}
	}
</script>

<style>
	.time-red{
		color: red!important;
	}
	.time{
		margin-top: 60rpx;
		padding: 6rpx 20rpx;
		font-size: 22rpx;
		color: #ccc;
	}
	.cont-1{
		background-color:  white;
		/* box-shadow: #C0C0C0 0rpx 0rpx 25rpx; */
	}
	.notice{
		color: white;
		/* padding: 10rpx 15rpx; */
		background-color: #333333;
		font-size: 27rpx;
		margin-bottom: 10rpx;
	}
	.content{
		/* height: 1000px; */
	}
	.cont-msg{
		background-color: white ;
		box-shadow:#ccc 0rpx 5rpx 0rpx; 
		padding:25rpx 25rpx 15rpx 25rpx;
		font-size: 32rpx;
		transition: all 2s;
		-webkit-transition: all 2s; /* Safari */
	}
	.ras-actile{
		border-bottom: 4rpx deepskyblue solid;
		font-weight: 700;
	}
	.cont-msg text{
		text-align: center;
		padding: 15rpx 15rpx;
		margin-bottom: 25rpx;
		color: #555555
	}
	.msg-con{
		margin:40rpx 20rpx;
		background-color: white;
		border-radius: 10rpx;
		box-shadow: #CCCCCC 0rpx 0rpx 10rpx;
	}
	.msg-1 image{
		width: 160rpx;
		height: 80rpx;
		position: absolute;
		top: 0;
		right: 0;
		opacity: .3;
	}
	.msg-lae{
		/* margin-bottom: 15rpx; */
		display: flex;
		justify-content:space-between
	}
	.msg-1{
		cursor: pointer;
		position: relative;
	}
	.msg-1 rich-text{
		font-size: 22rpx;
		padding: 0 18rpx;
		color: #555555;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	.msg-1 label{
		font-size: 25rpx;
		font-weight: 700;
		padding: 18rpx;
	}
	.msg-1 label:nth-child(2){
		color: #999999;
	}
	.none{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 400rpx;
	}
	.none image{
		width: 300rpx;
		height: 300rpx;
	}
</style>
