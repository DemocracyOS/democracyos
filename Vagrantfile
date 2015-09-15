provision = {}

provision['base'] = <<BASH
  sudo apt-get update
  sudo apt-get install gcc make build-essential git libkrb5-dev -y
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

provision['make'] = <<BASH
  cd /vagrant && make
BASH

Vagrant.configure(2) do |config|
  config.vm.box = 'ubuntu/trusty64'

  config.vm.provider 'virtualbox' do |v|
    host = RbConfig::CONFIG['host_os']

    # Give VM 1/4 system memory & access to all cpu cores on the host
    if host =~ /darwin/
      cpus = `sysctl -n hw.ncpu`.to_i
      # sysctl returns Bytes and we need to convert to MB
      mem = `sysctl -n hw.memsize`.to_i / 1024 / 1024 / 4
    elsif host =~ /linux/
      cpus = `nproc`.to_i
      # meminfo shows KB and we need to convert to MB
      mem = `grep 'MemTotal' /proc/meminfo | sed -e 's/MemTotal://' -e 's/ kB//'`.to_i / 1024 / 4
    else # sorry Windows folks, I can't help you
      cpus = 2
      mem = 1024
    end

    v.customize ['modifyvm', :id, '--memory', mem]
    v.customize ['modifyvm', :id, '--cpus', cpus]

    # Required for NFS to work, pick any local IP
    config.vm.network :private_network, ip: '192.168.50.50'
    # Use NFS for shared folders for better performance
    config.vm.synced_folder '.', '/vagrant', nfs: true
  end

  config.vm.network 'forwarded_port', guest: 3000, host: 3000 # server
  config.vm.network 'forwarded_port', guest: 27017, host: 27017 # mongodb

  provision.each do |name, script|
    config.vm.provision name, type: :shell, privileged: false, inline: script
  end
end
