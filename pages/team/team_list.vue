<template>
	<view class="content-s">
		<view class="cont-1">
			<view class="cont-task">
				<text v-for="(item,index) in tas_data" :key="index" @tap="tak_click(index)" v-bind:class="ras==index?'ras-actile':''">
					{{item}}
				</text>
				<image src="../../static/img/sousuo.png" @click="Search" mode=""></image>
			</view>
			<view class="content" v-if="team_data.length>0">
				<view class="team-con" v-for="(item,index) in team_data" :key="index">
					<view class="team-1" @tap="openinfo(item.id)">
						<image :src="item.head_por" mode=""></image>
						<view class="team-lae">
							<label >{{item.groups_name}}
								<text class="team_state">
									({{item.ide_name}})
									<text class="new" v-if="item.new"></text>
								</text>
							</label>
						</view>
						<view class="time"><text style="float: left;">团队人数：</text>{{item.team_num}}</view>
						
					</view>
				</view>
			</view>
			<view v-else class="none">
				<image src="../../static/img/none.png" mode=""></image>
			</view>
		</view>
		<view class="all-add" @tap="team_add()">
			<image src="../../static/img/jia.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	const apps=getApp().globalData.comm;
	import prompt from '../../components/popup/popup.vue';
	export default {
		components: {
			prompt,
		},
		data() {
			return{
				team_data:[],
				page:1,//页码
				ras:0,//最新任务导航切换
				tas_data:['我管理的','我加入的'],
			}
		},
		onLoad(){
			this.team_list(this.ras);
			var timer = null;
		},
		methods: {
			team_list(ste){
				uni.showNavigationBarLoading();
				var data={'page':this.page,'state':ste};
				this.$request(apps.api.team_list,data).then(res => {
					console.log(res)
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh();
					if(res.code==200){
						this.team_data=res.data
					}
				})
			},
			Search(){
				uni.navigateTo({
					url:'../search/index?types=team'
				})
			},
			submit(val){
				let value=val.value;
				this.$request(apps.api.team_)
			},
			tak_click(key){
				this.ras=key;
				this.team_list(key);
			},
			openinfo(e) {
				uni.navigateTo({
					url: '/pages/team/team_con?id='+e+'',//跳转页面
				});
			},
			team_add(e){
				uni.navigateTo({
					url: '/pages/team/team_add',//添加团队
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
	.cont-task image{
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 20rpx;
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
	.cont-team{
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
	.cont-team text{
		text-align: center;
		padding: 15rpx 15rpx;
		margin-bottom: 25rpx;
		color: #555555
	}
	.team-con{
		margin:20rpx 0;
		background-color: white;
		/* border-radius: 10rpx; */
		box-shadow: #CCCCCC 0rpx 0rpx 10rpx;
	}
	.team-1{
		position: relative;
	}
	.team-1 image{
		width: 120rpx;
		height: 100rpx;
		position: absolute;
		top: 0;
		right: 0;
		opacity: .3;
	}
	.team-lae{
		/* margin-bottom: 15rpx; */
		display: flex;
		justify-content:space-between
	}
	.team-1{
		cursor: pointer;
		position: relative;
	}
	.team-1 rich-text{
		font-size: 22rpx;
		padding: 0 18rpx;
		color: #555555;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	.team-1 label{
		font-size: 25rpx;
		font-weight: 700;
		padding: 18rpx;
	}
	.team-1 label:nth-child(2){
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
	.team_state{
		position: relative;
		color: #999999;
	}
	.new{
		position: absolute;
		width: 13rpx;
		height: 13rpx;
		background-color: red;
		border-radius: 50%;
		top: 10rpx;
	}
</style>
