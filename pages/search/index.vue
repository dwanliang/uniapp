<template>
	<view >
		<!-- #ifdef MP-WEIXIN -->
		<view class="search-block">
			<view class="search-ico-wapper">
				<image src="../../static/img/sousuo.png" class="search-ico" mode=""></image>
			</view>
			<input type="text" value="" placeholder="搜索" @input="onInput" class="search-text" maxlength="10" focus/>
		</view>
		<!-- #endif -->
		<view class="team_list">
			<view class="content" v-if="search_data.length">
				<view class="team-con" v-for="(item,index) in search_data" :key="index">
					<view class="team-1" @tap="openinfo(item.id)">
						<view class="team-lae">
							<image :src="item.head_por" mode=""></image>
							<label >{{item.groups_name}}</label>
						</view>
					</view>
				</view>
			</view>
			<view class="" v-else>
				
			</view>
		</view>
	</view>
	
</template>

<script>
	const apps=getApp().globalData.comm;
	export default{
		data(){
			return{
				search_data:[],
				type:'',
				timer:0,
			}
		},
		onLoad(e) {
			this.type=e.types;
		},
		methods:{
			onNavigationBarSearchInputChanged (val) {//APP、H5
				this.search(val.text,this.type)
			},
			onInput(val){//微信
				this.search(val.detail.value,this.type)
			},
			openinfo(id){
				uni.navigateTo({
					url:'../team/team_con?id='+id
				})
			},
			search(text,type){
				if(!text){
					this.search_data=[];
					return;
				}
				uni.showLoading({
					title:'正在加载',
				})
				var taht=this;
				if(type=='team'){
					clearTimeout(this.timer)
					this.timer=setTimeout(()=>{
						taht.$request(apps.api.team_search,{text:text}).then(res=>{
							uni.hideLoading()
							taht.search_data=res.data;
						})
					},300)
				}else{
					
				}
			}
		}
	}
</script>

<style>
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
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
	.team-lae{
		/* margin-bottom: 15rpx; */
		display: flex;
		align-items: center;
		/* justify-content:space-between */
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
	/* 搜索框 */
	.search-ico, .search-ico-1{
	    width: 40upx;
	    height: 40upx;
	}
	.search-text{
	    font-size: 14px;
	    background-color: #FFFFFF;
	    height: 60upx;
	    width: 480upx;
		border-bottom-right-radius:28rpx;
		border-top-right-radius:28rpx;
	}
	.search-block{
	    display: flex;
	    flex-direction: row;
	    /* padding-left: 60upx; */
	    position: relative;
		border: 1px #ccc solid;
		border-radius: 40rpx;
		margin: 0 40rpx;
	    /* top: -32upx; */
	}
	.search-ico-wapper{
	    background-color: #FFFFFF;
	    display: flex;
	    flex-direction:column;
	    justify-content: center;
	    padding: 0upx 0upx 0upx 40upx;
	    border-bottom-left-radius:28rpx;
	    border-top-left-radius: 28rpx;
	}
	.shadow{
	    width: 638upx;
	    height: 60upx;
	    border-radius:28rpx;
	    -moz-box-shadow:0 0 10px #e6e6e6;
	    -webkit-box-shadow:0 0 10px #e6e6e6;
	    box-shadow:0 0 10px #e6e6e6;
	    position: relative;
	    top: -90upx;
	    left: 60upx;
	}
</style>
