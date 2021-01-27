<template>
	<view class="content-s">
		<view class="cont-1">
			<view class="content" v-if="note_data.length>0">
				<checkbox-group>
					<view class="note-con" v-for="(item,index) in note_data" :key="index">
						<view class="note-1" @tap.stop="openinfo(item.id,index)" @longpress="long(index)">
							<view class="note-lae">
								<label >{{item.note_title}}</label>
							</view>
							<text>{{item.note_con}}</text>
							<label v-if="longFlag" class="all_checkbox">
								<checkbox :checked="item.checked"/>
							</label>
							<view class="time"><text style="float: left;"></text>{{item.add_time}}</view>
						</view>
					</view>
				</checkbox-group>
			</view>
			<view v-else class="none">
				<image src="../../static/img/none.png" mode=""></image>
			</view>
		</view>
		<uni-load-more :status="status[loadingType]" v-if="note_data.length>0"></uni-load-more>
		<view class="all-add" @tap="note_add()" v-if="!longFlag">
			<image src="../../static/img/jia.png" mode=""></image>
		</view>
		<!-- 长按组件 -->
		<longPress :longFlag="longFlag" :select_allfalg="select_allfalg" :data="note_data" @long_delete="note_delete" @longfalse="longfalse" @select_all="select_all"></longPress>
	</view>
</template>

<script>
	const apps=getApp().globalData.comm;
	import longPress from '../../components/longPress.vue'
	export default {
		components: {
			longPress
		},
		data() {
			return{
				note_data:[],
				page:1,//页码
				loadingText: '加载中...',
				loadingType: 0, //定义加载方式 0---contentdown  1---contentrefresh 2--contentnomore
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				status: ['','loading','noMore'],
				// 长按
				longFlag:false,//长按状态
				select_allfalg:false,//全选状态
			}
		},
		onLoad(){
			this.note_list();
			var timer = null;
		},
		onPullDownRefresh() { // 下拉刷新事件
			var that=this;
			that.page=1;
			that.note_data=[];
			setTimeout(function () {
				that.note_list(that.ras);
			}, 1000);
		},
		onReachBottom(){//上拉加载更多
			if (this.timer != null) {
				clearTimeout(this.timer);
			}
			var that=this;
			if (that.loadingType !== 0){//loadingType!=0;直接返回
				return false;
			}
			that.page++;//每触底一次 page +1
			that.loadingType = 1;
			setTimeout(function() {
				that.note_list();
			}, 1000);
		},
		methods: {
			note_list(ste){
				uni.showNavigationBarLoading();
				var data={'page':this.page};
				this.$request(apps.api.note_list,data).then(res => {
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh();
					var i=0;
					if(res.code==200){
						for(i in res.data.data){
							res.data.data[i].checked=false;//长按初始未选中
							this.note_data.push(res.data.data[i]);
						}
						this.loadingType = 0;//将loadingType归0重置
						if(res.data.last_page==this.page){
							this.loadingType = 2;
						}
					}else{
						this.loadingType = 2;
						return;
					}
					console.log(this.note_data)
				})
			},
			// 长按(start)
			long(index){
				if(this.longFlag)return;
				this.longFlag=true;
			},
			longfalse(val){//取消长按
				this.longFlag=val.longFlag
				this.note_data=val.data;
			},
			select_all(val){//长按全选
				this.select_allfalg=val.select_allfalg;
			},
			openinfo(e,index) {
				if(this.longFlag){//长按之后
					this.note_data[index].checked=!this.note_data[index].checked;
					if(!this.note_data[index].checked){
						this.select_allfalg=false;
					}
					var all_true=true;
					for(var i=0;i<this.note_data.length;i++){
						if(!this.note_data[i].checked){
							all_true=false;break;
						}
					}
					this.select_allfalg=all_true;
					return;
				}
				uni.navigateTo({
					url: '/pages/note/note_con?id='+e+'',//跳转页面
				});
			},
			note_delete(){
				if(!this.longFlag)return;
				var that=this;
				uni.showModal({
					title:'是否删除选中',
					success(res) {
						if(res.confirm){
							var long_Data=[];
							for(var i=0;i<that.note_data.length;i++){
								if(that.note_data[i].checked){
									long_Data.push(that.note_data[i].id);
								}
							}
							var data={ids:long_Data.join(',')};
							that.$request(apps.api.note_delete,data).then(res => {
								apps.tan(res.msg,1000)
								if(res.code==200){
									setTimeout(()=>{
										that.longFlag=false;
										that.note_data=[];
										that.note_list()
									},1000)
								}
							})
						}
					}
				})
			},
			// 长按(end)
			note_add(e) {
				uni.navigateTo({
					url: '/pages/note/note_add',//添加备忘录
				});
			},
		}
	}
</script>

<style>
	
	.note-1 text{
	    font-size: 12px;
	    padding: 0 9px;
	    color: #555555;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-line-clamp: 3;
	    -webkit-box-orient: vertical;
	}
	.time-red{
		color: red!important;
	}
	.time{
		margin-top: 20rpx;
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
	.cont-note{
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
	.cont-note text{
		text-align: center;
		padding: 15rpx 15rpx;
		margin-bottom: 25rpx;
		color: #555555
	}
	.note-con{
		margin:20rpx 0;
		background-color: white;
		border-radius: 10rpx;
		box-shadow: #CCCCCC 0rpx 0rpx 10rpx;
	}
	.note-1 image{
		width: 160rpx;
		height: 80rpx;
		position: absolute;
		top: 0;
		right: 0;
		opacity: .3;
	}
	.note-lae{
		/* margin-bottom: 15rpx; */
		display: flex;
		justify-content:space-between
	}
	.note-1{
		cursor: pointer;
		position: relative;
	}
	.note-1 text{
		display: inline-block;
		white-space: nowrap; 
		width: 75%; 
		overflow: hidden;
		text-overflow:ellipsis;
	}
	.note-1 rich-text{
		font-size: 22rpx;
		padding: 0 18rpx;
		color: #555555;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	.note-1 label{
		font-size: 25rpx;
		font-weight: 700;
		padding: 9rpx 18rpx;
	}
	.note-1 label:nth-child(2){
		color: #999999;
	}
	.none{
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		top:400rpx
	}
	.none image{
		width: 300rpx;
		height: 300rpx;
	}
</style>
