development:
  host: localhost
  database: r_development
  autocreate_indexes: true
  persist_in_safe_mode: true
  
test:
  host: localhost
  database: r_test
  autocreate_indexes: true
  persist_in_safe_mode: true
  
production:
  host: <%= ENV['MONGOID_HOST'] %>
  port: <%= ENV['MONGOID_PORT'] %>
  username: <%= ENV['MONGOID_USERNAME'] %>
  password: <%= ENV['MONGOID_PASSWORD'] %>
  database: <%= ENV['MONGOID_DATABASE'] %>
  persist_in_safe_mode: true