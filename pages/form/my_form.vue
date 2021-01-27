<template>
	<view class="content-s">
		<view class="cont-1">
			<view class="cont-task">
				<text v-for="(item,index) in tas_data" :key="index" @tap="tak_click(index)" v-bind:class="ras==index?'ras-actile':''">
					{{item}}
				</text>
			</view>
			<view class="content" v-if="form_data.length>0">
					<view class="form-con" :class="ras==1?'template':''" v-for="(item,index) in form_data" :key="index" >
						<view class="form-1" @longpress="long(index)" @tap="openinfo(item.id,ras,index)" :style="{background: 'linear-gradient(125deg,'+color[item.color1]+','+color[item.color2]+')'}" :class="item.checked && ras==1?'template_checked':''">
							<view class="form-lae">    
								<label >{{item.form_title}}</label>
								<label v-bind:class="item.time_few==1?'time-red':''" v-if="ras==0">{{item.time_ends}}</label>
							</view>
							<label v-if="longFlag && ras==0" class="all_checkbox">
								<checkbox :checked="item.checked"/>
							</label>
							<view class="time" v-if="ras==0"><text style="float: left;"></text><text class="count">{{item.count}}</text>条数据</view>
						</view>
					</view>
			</view>
			<view v-else class="none">
				<image src="../../static/img/none.png" mode=""></image>
			</view>
		</view>
		<uni-load-more :status="status[loadingType]" v-if="form_data.length>0"></uni-load-more>
		<view class="all-add" @tap="form_add()" v-if="!longFlag">
			<image src="../../static/img/jia.png" mode=""></image>
		</view>
		<!-- 长按组件 -->
		<longPress :longFlag="longFlag" :select_allfalg="select_allfalg" :data="form_data" @long_delete="form_delete" @longfalse="longfalse" @select_all="select_all"></longPress>
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
				ras:0,//最新任务导航切换
				tas_data:['我的表单','模板表单'],
				color:['#80ff80','#4dd2ff','#ff80aa','#eb99ff','#ff8080','#b3e0ff','#6666ff'],
				form_data:[],
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
			this.form_list();
			var timer = null;
		},
		onPullDownRefresh() { // 下拉刷新事件
			var that=this;
			that.page=1;
			that.form_data=[];
			setTimeout(function () {
				that.form_list(that.ras);
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
				that.form_list();
			}, 1000);
	  },
		methods: {
			form_list(ste){
				uni.showNavigationBarLoading();
				var data={'page':this.page};
				var url=apps.api.my_form;
				if(ste){
					Object.assign(data,{'coll':1})
					url=apps.api.form_template;
				}
				this.$request(url,data).then(res => {
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh();
					var i=0;
					for(i in res.data.data){
						res.data.data[i].checked=false;//长按初始未选中
						this.form_data.push(res.data.data[i]);
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
				})
			},
			tak_click(key){
				this.ras=key;
				this.longFlag=false;
				this.page=1;
				this.form_data=[];
				this.form_list(key);
			},
			// 长按(start)
			long(index){
				if(this.longFlag)return;
				this.longFlag=true;
			},
			longfalse(val){//取消长按
				this.longFlag=val.longFlag
				this.form_data=val.data;
			},
			select_all(val){//长按全选
				this.select_allfalg=val.select_allfalg;
			},
			openinfo(e,ras,index){
				if(this.longFlag){//长按之后
					this.form_data[index].checked=!this.form_data[index].checked;
					if(!this.form_data[index].checked){
						this.select_allfalg=false;
					}
					var all_true=true;
					for(var i=0;i<this.form_data.length;i++){
						if(!this.form_data[i].checked){
							all_true=false;break;
						}
					}
					this.select_allfalg=all_true;
					return;
				}
				if(!ras){
					uni.navigateTo({
						url: '/pages/form/form_data?id='+e+'',//跳转页面
					});
				}else{
					let color1=this.form_data[index].color1;
					let color2=this.form_data[index].color2;
					uni.navigateTo({
						url: '/pages/form/form_add?id='+e+'&color1='+color1+'&color2='+color2+'',//跳转页面
					});
				}
				
			},
			form_delete(){
				if(!this.longFlag)return;
				var that=this;
				uni.showModal({
					title:'是否删除选中',
					success(res) {
						if(res.confirm){
							var long_Data=[];
							for(var i=0;i<that.form_data.length;i++){
								if(that.form_data[i].checked){
									long_Data.push(that.form_data[i].id);
								}
							}
							var data={ids:long_Data.join(',')};
							that.$request(apps.api.form_delete,data).then(res => {
								apps.tan(res.msg,1000)
								if(res.code==200){
									setTimeout(()=>{
										that.longFlag=false;
										that.form_data=[];
										that.note_list()
									},1000)
								}
							})
						}
					}
				})
			},
			form_add(e) {
				uni.navigateTo({
					url: '/pages/form/form_add',//添加表单
				});
			},
			time_end(){//列表时间倒计时
				for(var i=0;this.form_data.length>i;i++){//表单列表长度for
					var lefttime=apps.time_ends(this.form_data[i].time_end)//获得表单剩余秒数
					if(lefttime<=0){
						this.form_data[i].time_ends="表单已结束"
						continue;
					}
					if(lefttime<300){//剩5分钟，字体变红
						this.form_data[i].time_few=1;
					}
					this.form_data[i].time_ends=apps.time_date(lefttime)//赋值倒计时
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
	.template_checked{
		/* box-shadow: #00FFFF 0 0 25rpx; */
		box-shadow: 5px 0px 28rpx red,-5px 0px 28rpx #00FFFF,0px 5px 28rpx #1a8cff,0px -5px 28rpx ;
	}
	.template{
		width: 40%!important;
		color: white;
	}
	.template label{
		font-size: 32rpx!important;
	}
	.count{
		color: #00bfff;
		font-size: 30rpx;
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
	.time-red{
		color: red!important;
	}
	.time{
		margin-top: 10rpx;
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
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		margin: 0 20rpx;
	}
	.cont-form{
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
	.cont-form text{
		text-align: center;
		padding: 15rpx 15rpx;
		margin-bottom: 25rpx;
		color: #555555
	}
	.form-con{
		margin:20rpx 0;
		background-color: white;
		border-radius: 10rpx;
		box-shadow: #CCCCCC 0rpx 0rpx 10rpx;
		width: 100%;
	}
	.form-1 image{
		width: 160rpx;
		height: 80rpx;
		position: absolute;
		top: 0;
		right: 0;
		opacity: .3;
	}
	.template .form-lae{
		justify-content: center;
		padding-bottom: 180rpx;
	}
	.form-lae{
		/* margin-bottom: 15rpx; */
		display: flex;
		justify-content:space-between
	}
	.form-1{
		cursor: pointer;
		position: relative;
	}
	.form-1 rich-text{
		font-size: 22rpx;
		padding: 0 18rpx;
		color: #555555;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	.form-1 label{
		font-size: 25rpx;
		font-weight: 700;
		padding: 18rpx;
	}
	.form-1 label:nth-child(2){
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
