function run() {
    if (document.getElementById('login-component')) {
        new Vue({
            el: '#login-component',
            data: {
                user: '',
                pass: '',
                message: '',
            },
            created: function() {
                console.log('Login component loaded');
            },
            methods: {
                login: function() {
                    // Simulate an authentication API call
                    if (this.user === 'root' && this.pass === 'pass') {
                        this.message = 'allow';
                        setTimeout(() => {
                            location.href = "/client/index.html"; // Redirect to the main page
                        }, 500); // Add a small delay before redirect
                    } else {
                        this.message = 'deny';
                    }
                }
            },
        });
    } else if (document.getElementById('app')) {
        new Vue({
            el: '#app',
            data: {
                newApplication: {
                    company: '',
                    position: '',
                    date: '',
                    notes: ''
                },
                applications: [],
                editingApplication: null,
                messages: [],
                message: '',
                socket: null
            },
            created: function() {
                this.fetchApplications();
                this.setupSocket();
            },
            methods: {
                fetchApplications: function() {
                    axios.get('http://localhost:8000/api/applications')
                        .then(response => {
                            this.applications = response.data;
                        })
                        .catch(error => {
                            console.error('Error fetching applications:', error);
                        });
                },
                createApplication: function() {
                    axios.post('http://localhost:8000/api/applications', this.newApplication)
                        .then(response => {
                            this.applications.push(response.data);
                            this.newApplication = { company: '', position: '', date: '', notes: '' };
                        })
                        .catch(error => {
                            console.error('Error creating application:', error);
                        });
                },
                editApplication: function(application) {
                    this.editingApplication = Object.assign({}, application);
                },
                updateApplication: function() {
                    axios.put(`http://localhost:8000/api/applications/${this.editingApplication.id}`, this.editingApplication)
                        .then(response => {
                            const index = this.applications.findIndex(app => app.id === this.editingApplication.id);
                            this.$set(this.applications, index, response.data);
                            this.editingApplication = null;
                        })
                        .catch(error => {
                            console.error('Error updating application:', error);
                        });
                },
                deleteApplication: function(id) {
                    axios.delete(`http://localhost:8000/api/applications/${id}`)
                        .then(response => {
                            this.applications = this.applications.filter(app => app.id !== id);
                        })
                        .catch(error => {
                            console.error('Error deleting application:', error);
                        });
                },
                cancelEdit: function() {
                    this.editingApplication = null;
                },
                setupSocket: function() {
                    this.socket = io.connect('http://localhost:8000');

                    this.socket.on('client-id', id => {
                        document.getElementById('client-id').innerText = `Client id: ${id}`;
                    });

                    this.socket.on('message-from-server', entry => {
                        this.messages.push(entry);
                    });
                },
                sendMessage: function() {
                    if (this.message.trim()) {
                        const entry = {
                            id: this.socket.id,
                            message: this.message.trim()
                        };
                        this.socket.emit('chat', entry);
                        this.message = '';
                    }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    run();
});
