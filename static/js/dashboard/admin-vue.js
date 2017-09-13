Vue.component('student_intro', {
    template: "#student_intro",
    delimiters: ['${', '}'],
    props: ["student_data"]
})

/* The base content of the reply letters */
var data = {
    accept_content: '，你好，\n' +
        '【原因】' +
        '我們誠摯地邀請你成為2021主顧榮譽書院的一份子。\n' +
        '請於2017/9/18，6PM整，蒞臨主顧未來教室。\n\n' +
        '主顧榮譽書院劉丹怡 (Dani)'
}

Vue.component('accept_letter', {
    template: "#accept_letter",
    delimiters: ['${', '}'],
    props: ["accept_data"],
    data: function () {
        return data
    }
})

Vue.component('reject_letter', {
    template: "#reject_letter",
    delimiters: ['${', '}'],
    props: ["reject_data"],
    data: function () {
        return data
    }
})

var vm = new Vue({
    el: "#app",
    delimiters: ['${', '}'],
    data: {
        members: [],
        member_data: "",
        page_index: 0,
        page_count: 8,
        status: 0,
        student_email: "",
        content: "",
        apply: 'default',
        showModal: false,
        num_of_people: 0
    },
    mounted() {
        /* Get application data by RESTful API */
        // var apply = document.getElementById('apply').getAttribute('value')
        this.access_data()
    },
    methods: {
        /* Show the modal of the student's introduction. */
        show_modal(id) {
            this.member_data = this.members[id]
            this.student_email = this.member_data.Student_email
            this.showModal = true
            data.accept_content = this.member_data.Student_name + data.accept_content
        },
        access_data() {
            var obj = this
            this.init_data()
            axios.get('/dashboard/get_application/' + obj.apply)
                .then(function (response) {
                    arr = response.data
                    obj.members = Object.keys(arr).map((key) => {
                        return arr[key]
                    })
                    obj.num_of_people = obj.members.length
                })
                .catch(function (error) {
                    console.log(error)
                });
        },
        init_data() {
            this.members = []
            this.page_index = 0
        },
        reject_apply(student_id) {
            var obj = this
            $('#myModal').modal('hide')
            var remove_id = 0
            obj.members.forEach((value, index, arr) => {
                if (obj.members[index]['Student_id'] == student_id) {
                    remove_id = index
                }
            })
            obj.members.splice(remove_id, 1)
            obj.num_of_people = obj.members.length
            axios.get('/dashboard/send_email/?student_id=' + student_id + '&permission=reject')
                .then(function (response) {
                })
                .catch(function (error) {
                    console.log(error)
                });
        }
    },
    computed: {
        /* Slice table data by page range */
        slice_table_data() {
            let start = this.page_index * this.page_count
            let end = (this.page_index + 1) * this.page_count

            return this.members.slice(start, end)
        },
        /* Compute page range */
        page_total() {
            return Math.ceil(this.members.length / this.page_count)
        },
        apply_status() {
            if (this.apply == 'default') {
                return '未審核'
            } else if (this.apply == 'accept') {
                return '通過'
            } else {
                return '未通過'
            }
        }
    },
    watch: {
        apply: function () {
            this.access_data()
        }
    }
})