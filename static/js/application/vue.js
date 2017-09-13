var coma = Vue.component('form-group', {
	template: "#form-group",
	delimiters: ['${', '}'],
	props: {
		value: String,
		label: String,
		maxlength: String,
		error_flag: Boolean,
		correct_flag: Boolean,
		name: String,
		error_message: String
	},
	data: function () {
		return {
			active: false,
		}
	},
	methods: {
		focus_input: function () {
			this.active = !this.active
			if (this.$refs.input.value.length > 0) {
				this.active = true
			}
		},
		updateValue: function () {
			this.$emit('input', this.$refs.input.value)
		}
	}
})
var vm = new Vue({
	el: "#app",
	delimiters: ['${', '}'],
	data: {
		disabled: 'disabled',
		data_target: '',
		name: '',
		student_id: '',
		student_class: '',
		email: '',
		introduction: '',
		hasInput: [],
		permission: [{
			name: false,
			class: false,
			id: false,
			email: false,
			introduction: false
		}],
		db_student_id: [],
	},
	mounted: function() {
		$('#myModal').modal('toggle')
		this.hasInput = Array.from({
			length: 5
		}, () => false)
		var obj = this
		/* Get application data by RESTful API */
		axios.get('/signup/get_member_data/')
			.then(function (response) {
				var arr = response.data
				arr = Object.keys(arr).map((key) => {
					return arr[key].Student_id
				})
				obj.db_student_id = arr
				console.log(obj.db_student_id)
				// console.log(response)
			})
			.catch(function (error) {
				console.log(error)
			});
	},
	computed: {
		check_student_name: function () {
			this.hasInput[0] = (this.hasInput[0]) ? this.hasInput[0] : this.name.length > 0
			if (this.hasInput[0]) {
				return !(this.permission[0].name = this.name.length > 0)
			} else {
				return false
			}
		},
		check_student_id: function () {
			var re = new RegExp(/^-?[\d.]+(?:e-?\d+)?$/)
			this.hasInput[1] = (this.hasInput[1]) ? this.hasInput[1] : this.student_id.length > 0
			if (this.hasInput[1]) {
				this.permission[0].id = (this.student_id.length == 9 && re.test(this.student_id) && !this.db_student_id.includes(this.student_id))
				return !this.permission[0].id
			} else {
				return false
			}
		},
		check_student_class: function () {
			this.hasInput[2] = (this.hasInput[2]) ? this.hasInput[2] : this.student_class.length > 0
			if (this.hasInput[2]) {
				return !(this.permission[0].class = this.student_class.length == 4)
			} else {
				return false
			}
		},
		check_student_email: function () {
			/* the regular expression of email */
			var re = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

			this.hasInput[3] = (this.hasInput[3]) ? this.hasInput[3] : this.email.length > 0

			if (this.hasInput[3]) {
				return !(this.permission[0].email = re.test(this.email))
			} else {
				return false
			}
		},
		check_student_introduction: function () {
			this.hasInput[4] = (this.hasInput[4]) ? this.hasInput[4] : this.introduction.length > 0
			if (this.hasInput[4]) {
				return !(this.permission[0].introduction = this.introduction.length > 0)
			} else {
				return false
			}
		},
	},
	watch: {
		permission: {
			handler: function (after, before) {
				var arr = this.permission[0]
				arr = Object.keys(arr).map((key) => {
					return arr[key]
				})
				for (var key in arr) {
					// console.log(arr[key])
					if (!arr[key]) {
						this.disabled = "disabled"
						this.data_target = ''
						break
					} else {
						this.disabled = ""
						this.data_target = '.modal'
					}
				}
			},
			deep: true,
		},
	},
	methods: {
		onSubmit: function (event) {
			var arr = this.permission[0]
			arr = Object.keys(arr).map((key) => {
				return arr[key]
			})
			arr.forEach((value) => {
				console.log(value)
			})
		}
	}
})