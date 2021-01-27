<template>
	<view class="container999">
		<view class='line'>
			<view class='lineLeft'>团队名称</view>
			<view class="lineRight">  
				<input class="input" v-model="team_name" data-name="name" placeholder-class="plaClass" placeholder='团队名称'></input>
			</view>
		</view>
		<view class="u-demo-wrap">
			<view class="u-demo-area">
				<u-toast ref="uToast"></u-toast>
				<view class="pre-box" v-if="!showUploadList">
					<view class="pre-item" v-for="(item, index) in lists" :key="index">
						<image class="pre-item-image" :src="item.url" mode="aspectFill"></image>
						<view class="u-delete-icon" @tap.stop="deleteItem(index)">
							<u-icon name="close" size="20" color="#ffffff"></u-icon>
						</view>
						<u-line-progress v-if="item.progress > 0 && !item.error" :show-percent="false" height="16" class="u-progress"
						 :percent="item.progress"></u-line-progress>
					</view>
				</view>
				<u-upload @on-choose-fail="onChooseFail" :before-remove="beforeRemove" ref="uUpload" :custom-btn="customBtn" :show-upload-list="showUploadList" :auto-upload="autoUpload"
				 :show-progress="showProgress" :deletable="deletable" :max-count="maxCount" @on-list-change="onListChange">
					<view v-if="customBtn" slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
						<u-icon name="photo" size="60" :color="$u.color['lightColor']"></u-icon>
					</view>
				</u-upload>
			</view>
		</view>
		<button type="primary" class="submit" @click="submit">
			添加
		</button>
	</view>
</template>

<script>
	const apps=getApp().globalData.comm;
	export default{
		data(){
			return{
				team_name:'',
				showUploadList: true,
				customBtn: false,
				autoUpload: false,
				showProgress: true,
				deletable: true,
				customStyle: false,
				maxCount: 1,
				lists: [], // 组件内部的文件列表
			}
		},
		onLoad(e){
			
		},
		methods:{
			submit(){//提交
				var team_name=this.team_name;
				if(!team_name){
					apps.tan('请填写团队名称！',1000);return;
				}
				if(this.lists.length==0){
					apps.tan('请选择团队头像！',1000);return;
				}
				var img_url=this.lists[0].url;
				// this.$request(apps.api.team_add,data).then(res => {
				// 	apps.tan(res.msg,1000)
				// 	if(res.code==200){
				// 		setTimeout(()=>{
				// 			uni.navigateTo({
				// 				url:'../team/team_list'
				// 			})
				// 		},1000)
				// 	}
				// })
				var url=apps.baseUrl+apps.api.team_add
				const uploadTask = uni.uploadFile({
				    url: url, 
				    filePath: img_url,
				    name: 'file',
				    formData: {
				        'uid':apps.user_id,
						'groups_name':team_name
				    },
				    success: (res) => {
						var data = JSON.parse(res.data);
						apps.tan(data.msg,1000)
						if(data.code==200){
							setTimeout(()=>{
								uni.navigateTo({
									url:'../team/team_list'
								})
							},1000)
						}
					}
				});
			},
			beforeRemove(index, lists) {
				return true;
			},
			onListChange(lists) {
				// console.log('onListChange', lists);
				this.lists = lists;
			},
			// GetChange(e){//电脑端
			// 	console.log(e)
			// }
		}
	}
	
	
</script>
	
<style>
	.check,.radio{
		display: flex;
		flex-wrap: wrap;
	}
	.check uni-label{
		padding: 0!important;
	}
	.check view{
		width: 33%;
		padding: 10rpx 0;
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
</style>
