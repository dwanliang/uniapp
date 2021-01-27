<template>
	<view class="u-m-t-20">
		<u-cell-group>
			<u-cell-item icon="man-add-fill"  @click="user_news" title="新的朋友"><text class="new" v-if="user_new"></text></u-cell-item>
			<u-cell-item icon="android-circle-fill"  @click="team_list" title="我的团队"><text class="new" v-if="team_new"></text></u-cell-item>
			<u-cell-item icon="account-fill"  @click="my_friend" title="我的朋友"></u-cell-item>
		</u-cell-group>
		<view class="char_list" v-if="chat_list.length>0">
			<view class="list-cell u-border-bottom" v-for="(item,index) in chat_list" :key="index" @click="chatroom(item.room_id,item.type,index)">
				<block v-if="item.type==1">
					<view class="name_img">
						<image :src="item.user_head" mode=""></image>
						<view>
							<view>{{item.user_name}}</view>
							<text>{{item.chat_con}}</text>
						</view>
					</view>
					<text>{{item.add_time}}</text>
				</block>
				<block v-else>
					<view class="name_img">
						<image :src="item.head_por" mode=""></image>
						<view>
							<view>{{item.groups_name}}</view>
							<text>{{item.chat_con}}</text>
						</view>
					</view>
					<text>{{item.add_time}}</text>
				</block>
			</view>
		</view>
		
	</view>
</template>

<script>
	const apps=getApp().globalData.comm;
	export default{
		data(){
			return{
				team_new:false,
				user_new:false,
				chat_list:[],
			}
		},
		onLoad() {
			this.main_index();
		},
		methods:{
			main_index(){
				this.$request(apps.api.main_index,{}).then(res=>{
					uni.stopPullDownRefresh();
					this.team_new=res.data.team_new
					this.user_new=res.data.user_new
					this.chat_list=res.data.chat_list;
				})
			},
			team_list(){
				uni.navigateTo({
					url:'../team/team_list'
				})
			},
			my_friend(){
				uni.navigateTo({
					url:'../user/my_friend'
				})
			},
			user_news(){
				uni.navigateTo({
					url:'../user/user_new'
				})
			},
			chatroom(id,type,index){
				let title='';
				if(type==1){
					title=this.chat_list[index].user_name;
				}else{
					title=this.chat_list[index].groups_name;
				}
				uni.navigateTo({
					url:'../chatroom/index?id='+id+'&title='+title
				})
			}
		}
	}
</script>

<style lang="scss">
	.name_img{
		view{
			display: flex;
			flex-wrap: wrap;
			view{
				width: 100%;
			}
			text{
				color: #9e9595;
				font-size: 18rpx;
			}
		}
	}
	.u-border-bottom{
		display: flex;
		align-items: center;
		padding: 18rpx;
		justify-content: space-between;
		image{
			width: 60rpx;
			height: 60rpx;
			border-radius: 5rpx;
			margin-right: 20rpx;
		}
		.name_img{
			display: flex;
			align-items: center;
			height: 80rpx;
		}
		text{
			float: right;
			color: #9e9595;
		}
	}
	.char_list{
		margin-top: 20rpx;
	}
	.u-m-t-20{
		margin: 0!important;
	}
	.new{
		position: absolute;
		width: 15rpx;
		height: 15rpx;
		background-color: red;
		border-radius: 50%;
		top: 44rpx;
		right: 64rpx;
	}
</style>
