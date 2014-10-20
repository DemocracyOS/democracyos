# create development.json file if it does not exist
file "/vagrant/config/development.json" do
  owner 'vagrant'
  group 'vagrant'
  mode 0644
  content ::File.open("/vagrant/config/sample.json").read
  action :create
end
# if github.token is present create .netrc else remove it
if !node.github_token.nil? then
    template "/home/vagrant/.netrc" do
        user 'vagrant'
        group 'vagrant'
        mode '0644'
    end
else
    file "/home/vagrant/.netrc" do
        action :delete
    end
end

# build
execute 'make packages' do
  cwd '/vagrant'
end
