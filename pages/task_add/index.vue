<template>
	<view class="container999">
		<view class='line'>
			<view class='lineLeft'>标题</view>
			<view class="lineRight">  
				<input class="input" v-model="title" data-name="name" placeholder-class="plaClass" placeholder='请输入标题'></input>
			</view>
		</view>
		<view class='line' v-if="group.length>0">
			<view class='lineLeft'>发布到</view>
			<view class="lineRight">
				<picker :range="group" :range-key="'groups_name'" @change="groupChange">
					{{ group[groupIndex].groups_name}} 
				</picker>
			</view>
		</view>
		<view class="line" v-else>
			<view class='lineLeft'>发布到</view>
			<view class="lineRight">  
				你还没有团队<text class="blue">去创建团队>>>>>>>></text>
			</view>
		</view>
		<view class='line'>
			<view class='lineLeft'>结束时间</view>
			<view class="lineRight">  
				<test-com beginYear="2021" endYear="2030" @show="show"></test-com>
			</view>
		</view>
		<view class='line' style="flex-wrap: wrap;">
			<view class='lineLeft'>任务内容</view>
			<view class="lineRight" style="margin-top: 20rpx;height: 300px;overflow-x: hidden;overflow-y: scroll;">  
				<jinEdit placeholder="请输入内容" v-model="task_con" @editOk="editOk" @get_cont="get_cont" uploadFileUrl="/#"></jinEdit>
			</view>
		</view>
		<!-- <view class='line'>
			<view class='lineLeft'>任务内容</view>
			<view class="lineRight">  
				<view class="container">
					<lRichTextEditor
						value=""
						@change="GetChange"
						>
					</lRichTextEditor>
				</view>
			</view>
		</view> -->
		<button type="primary" class="submit" @click="submit">
			提交
		</button>
	</view>
</template>

<script>
	const apps=getApp().globalData.comm;
	import testCom from '../../components/test_com.vue';
	import jinEdit from '../../components/jin-edit/jin-edit.vue';
	export default{
		components: {
			testCom,
			jinEdit
		},
		data(){
			return{
				group:[],
				groupIndex:0,
				time_end:'',
				title:'',
				task_con:'',
				placeholder: '开始输入...'
			}
		},
		onLoad(e){
			this.task_list(e.groups_id);
			
		},
		methods:{
			task_list(groups_id){
				var date={};
				if(groups_id){
					Object.assign(date,{groups_id:groups_id})
				}
				this.$request(apps.api.groups_list, date).then(res => {
					if(res.code==200){
						this.group=res.data;
					}
				})
			},
			show(val){
				this.time_end=val.selectRes;
			},
			editOk(res) {
			    console.log(res);
			},
			groupChange:function(e){
				this.groupIndex = e.detail.value;
			},
			get_cont(res){
				this.task_con=res;
			},
			submit(){//提交
				var groups_id=this.group[this.groupIndex].id;
				if(!groups_id){
					apps.tan('请选择组织',1000);return;
				}
				var time_end=this.time_end;
				if(time_end<Math.round(new Date()/1000)){
					apps.tan('结束时间必须大于当前时间',1000);return
				}
				var title=this.title;
				if(!title){
					apps.tan('请填写标题',1000);return
				}
				var task_con=this.task_con;
				if(!task_con){
					apps.tan('请填写任务内容',1000);return;
				}
				this.$request(apps.api.task_add,{
					'user_id':1,
					'groups_id':groups_id,
					'time_end':time_end,
					'title':title,
					'task_con':task_con
				}).then(res=>{
					apps.tan(res.msg,1000);
					if(res.code==200){
						setTimeout(()=>{
							uni.switchTab({
								url: '/pages/index/index'
							})
						},1000)
					}
					console.log(res)
				})
			},
			// GetChange(e){//电脑端
			// 	console.log(e)
			// }
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
