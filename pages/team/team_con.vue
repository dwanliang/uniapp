<template>
	<view class="content-s">
		<view class="cont-1">
			<view class="cont-task">
				<text v-for="(item,index) in ras_data" :key="index" @tap="tak_click(index)" v-bind:class="ras==index?'ras-actile':''">
					{{item}}
				</text>
				<image src="../../static/img/new.png" mode="" @click="team_new" v-if="state"></image>
				<text class="new" v-if="team_data.groups_data.new"></text>
			</view>
			<view class="content">
				<view class="states" v-if="ras==0">
					<view class='line'>
						<view class='lineLeft'>团队名称</view>
						<view class="lineRight">  
							<input class="input" :disabled="!state" v-model="team_data.groups_data.groups_name" data-name="name" placeholder-class="plaClass" placeholder='团队名称'></input>
						</view>
						<text @click="team_edit(1)" v-if="state || state<3">提交</text>
					</view>
					<view class='line'>
						<view class='lineLeft'>邀请码</view>
						<view class="lineRight">
							{{team_data.groups_data.code}}
						</view>
						<text @click="fuzhi">复制</text>
					</view>
					<view class="line">
						<view class="team_user">
							<view class='lineLeft'>团队成员</view>
							<view class="team-con">
								<view class="team-1" v-for="(item,index) in team_data.user_list" :key="index" @click="user_friend(item.user_id)">
									<view class="team-lae">
										<image :src="item.user_head" mode=""></image>
										<label style="margin-left: 55rpx;">
											{{item.user_name}}
											<label class="team_state">
												({{item.ide_name}})
												<block v-if="item.me">
													我
												</block>
											</label>
										</label>
										<block v-if="state">
											<view class="admins" @click.stop="admins(item.user_id,2)" v-if="item.state==3 && state==1">
												管
											</view>
											<view class="admins" @click.stop="admins(item.user_id,3)" v-if="item.state==2 && state==1">
												撤管
											</view>
											<view class="deletes" @click.stop="deletes(item.user_id)" v-if="state<item.state">
												踢
											</view>
										</block>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<teammsg :msgdata="msgdata" :id="id" :state="state" v-if="ras==1"></teammsg>
				<teamtask :id="id" :state="state" v-if="ras==2"></teamtask>
			</view>
			<button type="warn" class="sumbit" @click="out_team" v-if="state && !ras">
				退出团队
			</button>
			<button type="primary" class="sumbit" @click="team_user_add" v-else-if="!state">
				申请加入团队
			</button>
		</view>
	</view>
</template>

<script>
	const apps=getApp().globalData.comm;
	import teammsg from './team_msg.vue';
	import teamtask from './team_task.vue'
	export default {
		components:{
			teammsg,
			teamtask
		},
		data() {
			return{
				team_data:{
					'groups_data':{
						'code':'',
						'groups_name':''
					}
				},
				state:0,
				msgdata:[],//团队公告数据
				taskdata:[],//团队任务数据
				page:1,//页码
				task_page:1,//任务页面
				id:0,
				ras:0,//最新任务导航切换
				// ras_data:[],//导航栏
				ras_data:[],
				tourist_ras:['团队信息'],
				team_ras:['团队信息','公告','团队任务','团队活动'],
			}
		},
		onLoad(e){
			this.id=parseInt(e.id);
			this.team_list(e.id);
		},
		methods: {
			team_list(ste){
				uni.showNavigationBarLoading();
				var data={'id':this.id,'page':this.page,'state':ste};
				this.$request(apps.api.team_list,data).then(res => {
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh();
					if(res.code==200){
						this.team_data=res.data
						this.state=res.data.user.state
						if(!this.state){
							this.ras_data=this.tourist_ras;
						}else{
							this.ras_data=this.team_ras;
						}
					}
					uni.setNavigationBarTitle({
						title:res.data.groups_data.groups_name
					});
				})
			},
			user_friend(id){
				uni.navigateTo({
					url:'../user/user_friend?id='+id
				})
			},
			msg_list(id){
				var that=this;
				var data={'groups_id':id}
				this.$request(apps.api.team_msg,data).then(res => {
					if(res.code==200){
						that.msgdata=res.data;
					}
				})
			},
			tak_click(key){
				this.ras=key;
				if(key==1 && this.msgdata.length==0){
					this.msg_list(this.id);
				}
			},
			team_new(){
				uni.navigateTo({
					url:'team_new?id='+this.id
				})
			},
			admins(user_id,state){//设为管理员
				var data={'user_id':user_id,'id':this.id,'state':state};
				var that=this;
				this.$request(apps.api.team_admin,data).then(res => {
					apps.tan(res.msg,1000)
					if(res.code==200){
						that.team_list();
					}
				})
			},
			team_user_add(){//申请加团队
				this.$request(apps.api.team_user_add,{'groups_id':this.id}).then(res => {
					apps.tan(res.msg,1000)
					if(res.code==200){
						that.team_list();
					}
				})
			},
			deletes(user_id){//踢出团队
				var data={'user_id':user_id,'id':this.id};
				var that=this;
				uni.showModal({
				    title: '是否踢出该成员',
				    // content: '这是一个模态弹窗',
				    success: function (res) {
				        if (res.confirm) {
				            that.$request(apps.api.team_user_delete,data).then(res => {
				            	apps.tan(res.msg,1000)
				            	if(res.code==200){
				            		that.team_list();
				            	}
				            })
				        }
				    }
				});
			},
			out_team(){
				var data={'id':this.id};
				var that=this;
				uni.showModal({
				    title: '是否退出团队！',
				    success: function (res) {
				        if (res.confirm) {
				            that.$request(apps.api.team_user_delete,data).then(res => {
				            	apps.tan(res.msg,1000)
				            	if(res.code==200){
									setTimeout(()=>{
										uni.navigateTo({
											url:'./team_list'
										})	
									},1000)
				            		
				            	}
				            })
				        }
				    }
				});
			},
			team_edit(key){
				var con=this.team_data.groups_data.groups_name;
				if(!con){
					apps.tan('团队名称不能为空！');return;
				}
				var that=this;
				var data={'id':this.id,'con':con};
				this.$request(apps.api.team_edit,data).then(res => {
					apps.tan(res.msg,1000)
					if(res.code==200){
						that.team_list();
					}
				})
			},
			fuzhi(){
				var that=this;
				uni.setClipboardData({
				    data: that.team_data.groups_data.code,
				    success: function () {
				        
				    }
				});
			},
		}
	}
</script>

<style>
	.sumbit{
		margin-top: 100rpx;
	}
	.team_user .lineLeft{
		padding: 18rpx;
	}
	.team_user{
		width: 100%;
	}
	.lineLeft{
		width: 160rpx;
		padding: 0 18rpx;
		font-size: 28rpx;
		position: relative;
		top: 6rpx;
		font-weight: 800;
	}
	.line{
		border-bottom: 2rpx solid #cccc;
		padding: 18rpx 0;
		display: flex;
		position: relative;
	}
	.uni-input-input{
		width: 90%!important;
	}
	.line text{
		position: absolute;
		right: 0rpx;
		padding: 10rpx;
		background-color: white;
		top: 10rpx;
	}
	.lineRight{
		width: 100%;
		font-size: 30rpx;
	}
	.lineRight text{
		position: absolute;
		right: 0rpx;
		padding-right: 10rpx;
	}
	.admins{
		position: absolute;
		font-size: 30rpx;
		font-weight: 700;
		padding: 18rpx;
		right: 50rpx;
		color: #B3D4FC;
	}
	.deletes{
		color: red;
		position: absolute;
		font-size: 30rpx;
		font-weight: 700;
		/* top: 18rpx; */
		right: 18rpx;
	}
	.team_state{
		color: #999999;
		/* font-size: 30rpx; */
	}
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
	.cont-task{
		background-color: white ;
		box-shadow:#ccc 0rpx 5rpx 0rpx; 
		padding:25rpx 25rpx 15rpx 0;
		font-size: 32rpx;
		transition: all 2s;
		-webkit-transition: all 2s; /* Safari */
	}
	.cont-task image{
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 10rpx;
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
		background-color: white;
		max-height: 600rpx;
		overflow: hidden;
		overflow-y: scroll;
	}
	.team-1{
		position: relative;
	}
	.team-1 image{
		width: 60rpx;
		height: 60rpx;
		position: absolute;
		border-radius: 10rpx;
		top: 10rpx;
		left:0;
	}
	.team-lae{
		height: 80rpx;
		/* margin-bottom: 15rpx; */
		display: flex;
		justify-content:space-between;
		align-items: center;
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
	.team-add{
		position: fixed;
		bottom: 110rpx;
		right: 10rpx;
		font-size: 20rpx;
		display: flex;
		justify-content: center;
		background-color: deepskyblue;
		box-shadow: deepskyblue 0rpx 0rpx 15rpx;
		color: white;
		align-items: center;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
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
	.new{
		position: absolute;
		width: 13rpx;
		height: 13rpx;
		background-color: red;
		border-radius: 50%;
		top: 25rpx;
		padding: 0!important;
		right: 10rpx;
	}
</style>
