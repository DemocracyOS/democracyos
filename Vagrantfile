provision = {}

provision['base'] = <<BASH
  sudo apt-get update
  sudo apt-get install gcc make build-essential git -y
BASH

provision['mongodb'] = <<BASH
  sudo mkdir -p /data/db
  sudo apt-get install mongodb -y
  # allow connection from host machine
  sudo sed -i "s/bind_ip = */bind_ip = 0.0.0.0/" /etc/mongodb.conf
BASH

provision['nodejs'] = <<BASH
  curl -L http://git.io/n-install | bash -s -- -y
BASH

Vagrant.configure(2) do |config|
  config.vm.box = 'ubuntu/trusty64'

  config.vm.network 'forwarded_port', guest: 3000, host: 3000 # server
  config.vm.network 'forwarded_port', guest: 27017, host: 27017 # mongodb

  provision.each do |name, script|
    config.vm.provision name, type: :shell, inline: script
  end
end
