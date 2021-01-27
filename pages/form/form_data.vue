<template>
	<view v-if="tableData.length>0" class="">
		<!-- <mytable :tableHead="tableHead" :tableData="tableData" ></mytable> -->
		<wyb-table class='tables' ref="table" :headers="tableHead" :contents="tableData" height="600rpx"/><!--:url-col="urlCol"-->
		
		<view>
		<view class="daochu" @click="daochu">
			导出
		</view>
			<!-- <text @click="fuzhi">复制</text> -->
		</view>
	</view>
</template>
<script>
	const apps=getApp().globalData.comm;
	import mytable from "@/components/mytable/mytable.vue";
	import wybTable from '@/components/wyb-table/wyb-table.vue'
	export default {
		components: {
			mytable,
			wybTable
		},
		data() {
			return {
				tableData:[],
				tableHead: [],
				title:'',
				id:0,
				daochu_url:''
			}
		},
		onLoad(e){
			this.getList(e.id)
			this.id=e.id;
			
		},
		methods: {
			 getList(id){
				 this.$request(apps.api.form_data, {'id':id,'uid':1},'post').then(res => {
					 console.log(res)
					if(res.code==200){
						this.tableData=res.data.data;
						for(var i=0;i<res.data.coll_title.length;i++){
							this.tableHead.push({label: res.data.coll_title[i],key: 'name'+i})
						}
						this.title=res.data.form_title
						uni.setNavigationBarTitle({
							title:this.title
						});
					}
					this.daochu_url=apps.baseUrl+apps.api.form_daochu+'?id='+this.id+'&title='+this.title;
				 })
			},
			fuzhi(){
				uni.setClipboardData({
				    data: this.daochu_url,
				    success: function () {
				        console.log('success');
				    }
				});
			},
			daochu(){
				location.href=this.daochu_url;
			}
		}
	};
</script>

<style>
	.daochu{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100rpx;
		background-color: #0000FF;
		color: white;
		cursor: pointer;
	}
	.daochu_url{
		color: aqua;
		padding-right: 30rpx;
	}
	.wyb-table-scroll-view{
		/* height: 0!important; */
	}
</style>