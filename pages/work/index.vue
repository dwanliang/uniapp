<template>
	<view class="container">
		<view class="region">
			<view class="title">
				<text>工具</text>
			</view>
			<view class="work_con">
				<view class="lattice" @tap="daka()">
					<view class="lat1">
						<image src="../../static/img/daka.png" mode=""></image>
						打卡
					</view>
				</view>
				<view class="lattice" @tap="form()">
					<view class="lat1">
						<image src="../../static/img/biaodan.png" mode=""></image>
						信息收集
					</view>
				</view>
				<view class="lattice" @tap="note()">
					<view class="lat1">
						<image src="../../static/img/beiwanglu.png" mode=""></image>
						备忘录
					</view>
				</view>
			</view>
		</view>
		<view class="region">
			<view class="title">
				<text>学习</text>
			</view>
			<view class="work_con">
				<view class="lattice" @tap="course()">
					<view class="lat1">
						<image src="../../static/img/kebiao.png" mode=""></image>
						课表
					</view>
				</view>
				<view class="lattice" @tap="signin()">
					<view class="lat1">
						<image src="../../static/img/qiandao.png" mode=""></image>
						签到
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			daka(){//打卡
				uni.navigateTo({
					url: '/pages/daka/daka_list',//跳转页面
				});
			},
			note(){//打卡
				uni.navigateTo({
					url: '/pages/note/note_list',//跳转页面
				});
			},
			course(){//课表
				uni.navigateTo({
					url: '/pages/course/course_list',//跳转页面
				});
			},
			form(){//表单
				uni.navigateTo({
					url: '/pages/form/form_list',//跳转页面
				});
			}
		}
	}
</script>
	
<style>
	.container{
		width: 100%;
	}
	.region{
		margin-bottom: 60rpx;
	}
	.title{
		border-bottom: 1px solid #ccc;
		margin:20rpx 30rpx;
		padding-bottom: 10rpx;
	}
	.title text{
		padding-left: 10px;
		border-left: 8rpx solid #00BFFF;
	}
	.work_con{
		width: 93%;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
	}
	.lattice{
		width: 33%;
		height: 200rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		border: 2rpx solid #ccc;
		margin-right: -2rpx;
		margin-bottom: -2rpx;
		border-radius: 20rpx;
	}
	.lat1{
		height: 120rpx;
		width: 120rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
	}
	.iconfont{
		width: 100%;
		text-align: center;
	}
	.lat1 image{
		width: 80rpx;
		height: 80rpx;
	}
</style>
