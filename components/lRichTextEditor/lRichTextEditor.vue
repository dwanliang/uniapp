<template>
	<view>
		<RichTextEditor
			v-model="WatchValue"
			api-key="95vwhkmmpunt999v8czietowhhziur0qc12omy8m3z0qgw23"
			:init="{
				height: 500,
				plugins: [
				'advlist autolink lists link image charmap print preview anchor',
				'searchreplace visualblocks code fullscreen',
				'insertdatetime media table paste code wordcount',
				'autosave bbcode codesample directionality emoticons fullpage hr nonbreaking pagebreak save tabfocus template toc visualchars'
				],
				toolbar:
					['undo redo | formatselect | bold italic underline forecolor backcolor hr | \
					alignleft aligncenter alignright alignjustify | \
					bullist numlist outdent indent | lists image media | removeformat fullscreen',
					'restoredraft charmap codesample | ltr rtl | emoticons fullpage insertdatetime |\
					link nonbreaking pagebreak paste | preview print | save searchreplace template | toc visualblocks visualchars | wordcount',
					'table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol'],
				language: 'zh_CN',
				images_upload_url: '/demo/upimg.php',
				file_picker_callback: function(callback, value, meta) {},
				branding: false,
				draggable_modal: true
			}"
		/>
	</view>
</template>

<script>
	import Editor from '../tinymce/tinymce-vue'
	export default {
		props:{
			value:String
		},
		components: {
		    'RichTextEditor': Editor
		},
		data() {
			return {
				WatchValue:this.value
			};
		},
		watch:{
			WatchValue(value){
				this.$emit('change',value)
			}
		}
	}
</script>

<style>

</style>
