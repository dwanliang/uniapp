<template>
	<view class="container999">
		<view class='line' style="flex-wrap: wrap;">
			<view class='lineLeft'>公告内容</view>
			<view class="lineRight" style="margin-top: 20rpx;height: 300px;overflow-x: hidden;overflow-y: scroll;">  
				<textarea v-model="msg_con" placeholder="请输入公告内容"/>
			</view>
		</view>
		<button type="primary" class="submit" @click="submit">
			提交
		</button>
		
	</view>
</template>

<script>
	const apps=getApp().globalData.comm;
	export default{
		data(){
			return{
				title:'',
				msg_con:'',
				placeholder: '开始输入...',
				id:0
			}
		},
		onLoad(e){
			this.id=e.id;
		},
		methods:{
			submit(){//提交
				var msg_con=this.msg_con;
				if(!msg_con){
					apps.tan('请填写公告内容',1000);return;
				}
				var groups_id=this.id;
				this.$request(apps.api.msg_add,{
					'msg_con':msg_con,
					'groups_id':groups_id
				}).then(res=>{
					apps.tan(res.msg,1000);
					if(res.code==200){
						setTimeout(()=>{
							uni.navigateTo({
								url: '/pages/team/team_con?id='+groups_id
							})
						},1000)
					}
				})
			},
		}
	}
	
	
</script>
	
<style>
	.lineLeft{
		width: 160rpx;
		/* float: left; */
		padding: 0 20rpx;
		font-size: 28rpx;
		position: relative;
		top: 6rpx;
		font-weight: 800;
	}
	.line{
		border-bottom: 2rpx solid #cccc;
		padding: 24rpx;
		padding-bottom: 20rpx;
		display: flex;
	}
	.lineRight{
		width: 100%;
		font-size: 30rpx;
	}
	.buttonBox{
		width: 80%;
		background-color: deepskyblue;
		color: white;
		text-align: center;
		margin: 0 auto;
		padding: 20rpx;
		border-radius: 36rpx;
		position: fixed;
		bottom: 300rpx;
		left: 8%;
	}
	.container{
		padding: 0;
	}
	.ql-container{
		margin: 0;
	}
	.blue{
		color: blue;
	}
</style>
