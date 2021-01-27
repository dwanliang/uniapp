<template>
	<u-index-list :scrollTop="scrollTop" :index-list="indexList">
		<view v-for="(item, index) in list" :key="index">
			<block v-if="item.data.length>0">
				<u-index-anchor :index="item.letter" />
				<view class="list-cell u-border-bottom" v-for="(item1,index) in item.data" :key="index" @click="user_friend(item1.user_id)">
					<image :src="item1.user_head" mode=""></image>
					{{item1.user_name}}
				</view>
			</block>
		</view>
	</u-index-list>
</template>

<script>
	const apps=getApp().globalData.comm;
	// import indexList from "@/commonality/index.list.js";
	// const letterArr = indexList.list.map(val => {
	// 	return val.letter;
	// })
	export default {
		data() {
			return {
				scrollTop: 0,
				indexList: [],
				list: ''
			}
		},
		onLoad() {
			this.friend_list();
		},
		methods:{
			friend_list(){
				this.$request(apps.api.my_friend,{}).then(res=>{
					if(res.code==200){
						this.indexList = res.data.map(val => {
							return val.letter;
						})
						this.list=res.data
					}
				})
			},
			user_friend(id){
				uni.navigateTo({
					url:'user_friend?id='+id
				})
			},
		},
		
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
			console.log(this.scrollTop)
		}
	}
</script>

<style lang="scss" scoped>
	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: $u-content-color;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}
	.u-border-bottom{
		display: flex;
		align-items: center;
		image{
			width: 60rpx;
			height: 60rpx;
			border-radius: 10rpx;
			margin-right: 10rpx;
		}
	}
</style>
