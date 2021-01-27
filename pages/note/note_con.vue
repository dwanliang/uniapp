<template>
	<view class="note_con">
		<view class='line' style="flex-wrap: wrap;">
			<view class='lineLeft title' @click="laa">{{note_data.note_title}}</view>
			<view class="lineRight" style="margin-top: 20rpx;height: 500px;overflow-x: hidden;overflow-y: scroll;">  
				<textarea v-model="note_data.note_con" id="abc" maxlength="1000" :focus="focus" @focus.stop="focus_input()" @blur="blur_input()" value="" placeholder="" />  
			</view>
		</view>
<!-- 		<view @click="revoke(1)">
			<<——
		</view>
		<view @click="revoke">
			——>>
		</view> -->
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
				note_data:[],
				id:1,
				focus:false,
				note_cons:'',
				note_cons:'',//
				revokefront_data:[],//撤销前
				revokeIndex:0,
			}
		},
		onLoad(e) {
			this.id=e.id;
			this.note_con(e.id);
		},
		methods:{
			note_con(id){
				this.$request(apps.api.note_list,{note_id:id}).then(res=>{
					if(res.code==200){
						this.note_cons=res.data.note_con;
						// this.note_conss=res.data.note_con;
						// this.revokefront_data[0]=res.data.note_con
						this.note_data=res.data;
					}
				})
			},
			submit() {//头部按钮
				if(this.note_cons==this.note_data.note_con) return;
				this.$request(apps.api.note_edit,{note_id:this.id,note_con:this.note_data.note_con}).then(res=>{
					this.note_cons=this.note_data.note_con;
				})
			},
			focus_input(){
				setTimeout(()=>{  
					this.focus=true  
				},100)  
			},  
			blur_input(){
				setTimeout(()=>{
					this.focus=false
				},100)
			},
			//撤销功能
			// record(val){
			// 	if(val.detail.value==this.note_conss){
			// 		return;
			// 	}
			// 	this.revokefront_data.push(val.detail.value);
			// 	this.note_conss=val.detail.value;
			// },
			// revoke(key){
			// 	if(key==1){
			// 		var length=this.revokefront_data.length-2;
			// 		if(this.revokeIndex>length){
			// 			return;
			// 		}
			// 		this.note_data.note_con=this.revokefront_data[length-this.revokeIndex];
			// 		this.revokeIndex++;
			// 	}else{
			// 		if(this.revokeIndex==0){
			// 			return;
			// 		}
			// 		this.revokeIndex--;
			// 		var length=this.revokefront_data.length-1;
			// 		this.note_data.note_con=this.revokefront_data[length-this.revokeIndex];
					
			// 	}
			// }
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
</style>
