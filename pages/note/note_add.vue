<template>
	<view class="note_con container">
		<view class='line'>
			<view class='lineLeft'>标题</view>
			<view class="lineRight">  
				<input class="input" v-model="note_title" data-name="name" placeholder-class="plaClass" placeholder='请输入标题'></input>
			</view>
		</view>
		<view class='line' style="flex-wrap: wrap;">
			<view class="lineRight" style="margin-top: 20rpx;height: 500px;overflow-x: hidden;overflow-y: scroll;">  
				<textarea v-model="note_con" id="abc" maxlength="1000"value="" placeholder="" />  
			</view>
		</view>
		<button type="primary" class="submit" @click="submit">
			保存
		</button>
	</view>
	
</template>

<script>
	const apps=getApp().globalData.comm;
	export default{
		data(){
			return{
				note_con:'',
				note_title:'',
			}
		},
		onLoad() {
			
		},
		methods:{
			submit() {
				this.$request(apps.api.note_add,{note_con:this.note_con,note_title:this.note_title}).then(res=>{
					apps.tan(res.msg,1000);
					if(res.code==200){
						setTimeout(()=>{
							uni.navigateTo({
								url:'note_list'
							})
						},1000)
					}
				})
			},
		}
	}
</script>

<style>
	uni-textarea{
		width: 100%!important;
	}
	.note_con{
		padding: 20rpx;
	}
	.title{
		font-weight: 700;
	}
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
	.container{
		padding: 0;
	}
</style>
