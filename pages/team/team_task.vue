<template>
	<view class="content-s">
		<view class="cont-1">
			<view class="content" v-if="task_data.length>0">
				<view class="task-con" v-for="(item,index) in task_data" :key="index">
					<view class="task-1" @tap="openinfo(item.id)">
						<view class="task-lae">
							<label >{{item.title}}</label>
							<label v-bind:class="item.time_few==1?'time-red':''">{{item.time_ends}}</label>
						</view>
						<rich-text :nodes="item.task_con"></rich-text>
						<view class="time"><text style="float: left;">{{item.user_name}}</text>{{item.time_start}}</view>
						<image src="../../static/img/top.png" mode="" v-if="item.type==1"></image>
						<image src="../../static/img/over.png" mode="" v-if="item.type==2"></image>
					</view>
				</view>
			</view>
			<view v-else class="none">
				<image src="../../static/img/none.png" mode=""></image>
			</view>
		</view>
		<uni-load-more :status="status[loadingType]"></uni-load-more>
		<view class="all-add" @tap="task_add()" v-if="state<3">
			<image src="../../static/img/jia.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	const apps=getApp().globalData.comm;
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default{
		components: {
			uniLoadMore,
		},
		name:'teammsg',
		props:{
			id: {
				type: [Number],
			},
			state: {
				type: [Number],
			},
		},
		mounted(){
			this.task_list(this.id);
			var timer = null;
		},
		data() {
			return {
				task_data:[],
				page:1,//页码
				loadingText: '加载中...',
				loadingType: 0, //定义加载方式 0---contentdown  1---contentrefresh 2--contentnomore
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				status: ['more','loading','noMore'],
			};
		},
		onReachBottom() {//上拉加载更多
			if (this.timer != null) {
				clearTimeout(this.timer);
			}
			var that=this;
			console.log(that.page)
			if (that.loadingType !== 0) {//loadingType!=0;直接返回
				return false;
			}
			that.page++;//每触底一次 page +1
			that.loadingType = 1;
			setTimeout(function() {
				that.task_list();
			}, 1000);
			
		},
		methods:{
			task_list(id){
				uni.showNavigationBarLoading();
				var data={'page':this.page,'groups_id':id};
				this.$request(apps.api.task_list,data).then(res => {
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh();
					var i=0;
					for(i in res.data.data){
						this.task_data.push(res.data.data[i]);
					}
					if(res.code==200){
						this.loadingType = 0;//将loadingType归0重置
						this.time_end();
						if(res.data.last_page==this.page){
							this.loadingType = 2;
						}
					}else{
						this.loadingType = 2;
						return;
					}
					console.log(this.status[0])
				})
			},
			openinfo(e) {
				uni.navigateTo({
					url: '/pages/task_con/index?id='+e+'',//跳转页面
				});
			},
			task_add(e) {
				uni.navigateTo({
					url: '/pages/task_add/index?groups_id='+this.id,//添加任务
				});
			},
			time_end(){//列表时间倒计时
				for(var i=0;this.task_data.length>i;i++){//任务列表长度for
					var lefttime=apps.time_ends(this.task_data[i].time_end)//获得任务剩余秒数
					if(lefttime<=0){
						this.task_data[i].time_ends="任务已结束"
						continue;
					}
					if(lefttime<300){//剩5分钟，字体变红
						this.task_data[i].time_few=1;
					}
					this.task_data[i].time_ends=apps.time_date(lefttime)//赋值倒计时
				}
				setTimeout(()=>{//递归
					this.$forceUpdate()//重新渲染
					this.time_end();
				},1000)
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
	.cont-task{
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
	.cont-task text{
		text-align: center;
		padding: 15rpx 15rpx;
		margin-bottom: 25rpx;
		color: #555555
	}
	.task-con{
		margin:40rpx 20rpx;
		background-color: white;
		border-radius: 10rpx;
		box-shadow: #CCCCCC 0rpx 0rpx 10rpx;
	}
	.task-1 image{
		width: 160rpx;
		height: 80rpx;
		position: absolute;
		top: 0;
		right: 0;
		opacity: .3;
	}
	.task-lae{
		/* margin-bottom: 15rpx; */
		display: flex;
		justify-content:space-between
	}
	.task-1{
		cursor: pointer;
		position: relative;
	}
	.task-1 rich-text{
		font-size: 22rpx;
		padding: 0 18rpx;
		color: #555555;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	.task-1 label{
		font-size: 25rpx;
		font-weight: 700;
		padding: 18rpx;
	}
	.task-1 label:nth-child(2){
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
