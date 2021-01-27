<template>
	<view class="new_con">
		<view class="banner">
			<label class="new_th">用户</label>
			<label class="new_th">类型</label>
			<label class="new_th">操作</label>
		</view>
		<view class="new_data" v-if="new_data.length>0">
			<view class="new_list" v-for="(item,index) in new_data" :key="index">
				<label>{{item.user_name}}</label>
				<label>
					<block v-if="item.type==1">
						添加好友
					</block>
				</label>
				<view class="operation">
					<block v-if="item.type==1">
						<block v-if="item.state==1">
							<text @click="edit_operation(item.id,3,item.user_id)">拒绝</text><text @click="edit_operation(item.id,2,item.user_id)">同意</text>
						</block>
						<block v-if="item.state==2">
							<view>已同意</view>
						</block>
						<block v-if="item.state==3">
							<view>已拒绝</view>
						</block>
					</block>
					
				</view>
			</view>
		</view>
		<view class="" v-else>
			无数据
		</view>
		
	</view>
</template>

<script>
	const apps=getApp().globalData.comm;
	export default{
		data(){
			return{
				id:0,
				new_data:[],
			}
		},
		onLoad(e) {
			this.id=e.id;
			this.new_list();
		},
		methods:{
			new_list(id){
				this.$request(apps.api.user_new,{}).then(res=>{
					if(res.code==200){
						this.new_data=res.data;
					}
				})
			},
			edit_operation(new_id,state,user_id){
				this.$request(apps.api.user_new_edit,{new_id:new_id,state:state,user_id:user_id}).then(res => {
					apps.tan(res.msg,1000)
					if(res.code==200){
						this.new_list();
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.banner,.new_list{
		display: flex;
		justify-content: center;
		align-items: center;
		label{
			display: flex;
			padding: 10rpx 0;
		}
		label:nth-child(1){
			padding-left: 10rpx;
			width: 35%;
			justify-content: left;
			border-right: 2rpx solid #ccc;
		}
		label:nth-child(2){
			width: 35%;
			justify-content: center;
			border-right: 2rpx solid #ccc;
		}
		label:nth-child(3){
			width: 30%;
			justify-content: center;
		}
		.operation{
			width: 30%;
			display: flex;
			justify-content: center;
			text{
				padding: 10rpx;
				border-radius: 15rpx;
				color: white;
				margin: 0 10rpx;
			}
			text:nth-child(1){
				background-color: #C8C7CC;
			}
			text:nth-child(2){
				background-color: #99ddff;
			}
			view{
				color: #ccc;
			}
		}
	}
	.new_list{
		padding-top: 10rpx;
	}
	.banner{
		label:nth-child(1){
			background-color: #e5f7ff;
		}
		label:nth-child(2){
			background-color: #ffcccc;
		}
		label:nth-child(3){
			background-color: #e5ccff;
		}
	}

</style>
