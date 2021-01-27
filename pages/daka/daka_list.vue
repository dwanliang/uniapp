<template>
	<view class="content-s">
		<view class="cont-1">
			<view class="content">
				<view class="daka-con" v-for="(item,index) in daka_data" :key="index">
					<view class="daka-1">
						<view class="daka-lae">
							<label >{{item.groups_name}}</label>
							<label v-bind:class="item.time_few==1?'time-red':''">{{item.time_ends}}</label>
						</view>
						<view class="daka" @tap="daka(item.id)" v-if="!item.state">
							打卡
						</view>
						<image v-if="item.state==1" src="../../static/img/yidaka.png" class="daka yidaka" mode=""></image>
						<image v-if="item.state==2" src="../../static/img/weidaka.png" class="daka yidaka" mode=""></image>
						<image v-if="item.state==3" src="../../static/img/weikaishi.png" class="daka yidaka" mode=""></image>
						<text>{{item.daka_con}}</text>
						<view class="time"><text style="float: left;">{{item.user_name}}</text>{{item.time}}</view>
					</view>
				</view>
			</view>
			
		</view>
		<view class="all-add" @tap="daka_add()">
			<image src="../../static/img/jia.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	const apps=getApp().globalData.comm;
	export default {
		data() {
			return{
				ras:0,//最新任务导航切换
				// daka_data:[{
				// 	id:1,
				// 	daka_name:"南宁号角猫科技有限公司",
				// 	time_end:1606299803000,
				// 	time_ends:"",
				// 	time_start:1606298803000,
				// 	daka_remarks:"上班打卡，迟到十分钟扣十块钱",
				// 	time_few:0,
				// 	time:'2020-11-24 16:16:45'
				// }],
				daka_data:[],
				page:1,//页码
				loadingText: '加载中...',
				loadingType: 0, //定义加载方式 0---contentdown  1---contentrefresh 2--contentnomore
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				status: ['','loading','noMore'],
			}
		},
		onLoad(){
			this.daka_list();
			var timer = null;
		},
		onPullDownRefresh() { // 下拉刷新事件
			var that=this;
			that.page=1;
			that.daka_data=[];
			setTimeout(function () {
				that.daka_list(that.ras);
			}, 1000);
		},
		onReachBottom() {//上拉加载更多
			if (this.timer != null) {
				clearTimeout(this.timer);
			}
			var that=this;
			if (that.loadingType !== 0) {//loadingType!=0;直接返回
				return false;
			}
			that.page++;//每触底一次 page +1
			that.loadingType = 1;
			setTimeout(function() {
				that.daka_list();
			}, 1000);
		},
		methods: {
			daka_list(ste){
				uni.showNavigationBarLoading();
				var data={'page':this.page};
				this.$request(apps.api.daka_list,data).then(res => {
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh();
					var i=0;
					for(i in res.data.data){
						this.daka_data.push(res.data.data[i]);
					}
					
					console.log(this.daka_data)
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
				})
			},
			
			tak_click(key){
				this.ras=key;
			},
			daka(id) {
				var data={daka_id:id}
				this.$request(apps.api.daka,data).then(res => {
					apps.tan(res.msg,1000)
					if(res.code==200){
						setTimeout(()=>{
							this.daka_data=[];
							this.daka_list()
						},1000)
					}
				})
			},
			daka_add(e) {
				uni.navigateTo({
					url: '/pages/daka/daka_add',//添加任务
				});
			},
			time_end(){//列表时间倒计时
				for(var i=0;this.daka_data.length>i;i++){//任务列表长度for
					var righttime=apps.time_ends(this.daka_data[i].time_start)//获得打卡什么时候开始秒数
					var lefttime=apps.time_ends(this.daka_data[i].time_end)//获得任务剩余秒数
					if(righttime>0){
						this.daka_data[i].time_ends='即将开始'+apps.time_date(righttime)//赋值倒计时
						// this.daka_data[i].state=3;
					}else{
						if(this.daka_data[i].state==3){
							this.daka_data[i].state='';
						}
						if(lefttime<=0){
							this.daka_data[i].time_ends="打卡已结束"
							if(!this.daka_data[i].state){
								this.daka_data[i].state=2;
							}
							
							continue;
						}
						if(lefttime<300){//剩5分钟，字体变红
							this.daka_data[i].time_few=1;
						}
						this.daka_data[i].time_ends=apps.time_date(lefttime)//赋值倒计时
					}
					
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
		padding: 6rpx 4rpx;
		font-size: 22rpx;
		color: #ccc;
	}
	.cont-1{
		background-color:  white;
		/* box-shadow: #C0C0C0 0rpx 0rpx 25rpx; */
	}
	.notice{
		color: white;
		padding: 10rpx 15rpx;
		background-color: #333333;
		font-size: 27rpx;
	}
	.content{
		/* height: 1000px; */
	}
	.cont-daka{
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
	.cont-daka text{
		text-align: center;
		padding: 15rpx 15rpx;
		margin-bottom: 25rpx;
		color: #555555
	}
	.daka-con{
		margin:10rpx 20rpx;
		background-color: white;
		border-radius: 10rpx;
		box-shadow: #CCCCCC 0rpx 0rpx 10rpx;
	}
	.daka-lae{
		/* margin-bottom: 15rpx; */
		display: flex;
		justify-content:space-between
	}
	.daka-1{
		cursor: pointer;
		position: relative;
	}
	.daka-1 text{
		font-size: 22rpx;
		padding: 0 18rpx;
		color: #555555;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	.daka-1 label{
		font-size: 25rpx;
		font-weight: 700;
		padding: 18rpx;
	}
	.daka-1 label:nth-child(2){
		color: #999999;
	}
	
	.daka{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background-color: deepskyblue;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 30rpx;
		box-shadow: deepskyblue 0 0 15rpx;
	}
	.yidaka{
		background-color:unset;
		box-shadow:none;
	}
</style>
