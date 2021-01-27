<template>
	<view class="content">
		<view class="task-con" v-for="(item,index) in task_data" :key="index">
			<view class="task-1">
				<view class="task-lae">
					<label >{{item.title}}</label>
					<label v-bind:class="item.time_few==1?'time-red':''">{{item.time_ends}}</label>
				</view>
				<rich-text :nodes="item.task_con"></rich-text>
			</view>
		</view>
		<view class="bottom_com">
			<view class="com_con">
				<view v-if="!task_data[0].top" class="coll" @click="task_oper(1)">置顶</view>
				<view v-else class="coll colls" @click="task_oper(1)">已置顶</view>
				<view v-if="!task_data[0].coll" class="top" @click="task_oper(2)">收藏</view>
				<view v-else class="top tops" @click="task_oper(2)">已收藏</view>
				<view v-if="!task_data[0].over" class="over" @click="task_oper(3)">完成</view>
				<view v-else class="over overs" @click="task_oper(3)">已完成</view>
			</view>
		</view>
	</view>
	
</template>
<style>
	
</style>
<script>
	const apps=getApp().globalData.comm;
	export default{
		data(){
			return{
				task_data:[{
					'top':0,
					'coll':0,
					'over':0
				}],
				id:0,
			}
		},
		onLoad(e){
			this.task_con(e.id);
			this.id=e.id;
		},
		methods:{
			task_con(id){
				this.$request(apps.api.task_list, {'id':id,'uid':apps.user_id},'post').then(res => {
					if(res.code==200){
						this.task_data=res.data.data;
						this.time_end();
					}
				})
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
			task_oper(key){
				var da=this.task_data[0]
				var data= key==1?da.top:key==2?da.coll:da.over;
				if(!data){
					data=1
				}else{
					if(key==3) return
					data=0
				}
				console.log(this.task_data)
				this.$request(apps.api.task_oper, {
					'task_id':this.id,
					'type':key,
					'state':data
				},'post').then(res => {
					if(res.code==200){
						this.task_con(this.id)
					}
					apps.tan(res.msg,1000);
				})
			}

		}
	}
</script>

<style>
	.task-con{
		/* margin:20rpx; */
		/* padding-bottom: 15rpx; */
		padding: 20rpx;
		background-color: white;
		border-radius: 10rpx;
	}
	.task-lae{
		display: flex;
		justify-content:space-between
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
	.content{
		height: 100%;
	}
	.bottom_com{
		width: 100%;
		position: fixed;
		height: 100rpx;
		bottom: 0;
	}
	.com_con{
		height: 100rpx;
		display: flex;
	}
	.com_con view{
		height: 100rpx;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.coll{
		width: 20%;
		background-color: #007AFF;
	}
	.colls{
		background-color: #a64dff;
	}
	.top{
		width: 20%;
		background-color: #d98c8c;
	}
	.tops{
		background-color: #666600;
	}
	.over{
		width: 60%;
		background-color: deepskyblue;
	}
	.overs{
		background-color: #c2c2d6;
	}
</style>
