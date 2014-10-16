#!/usr/bin/env bash

GITHUB_TOKEN=$1

install_os_dependencies () {
    sudo apt-get install -y nodejs-legacy \
                            npm \
                            git \
                            mongodb
}

configure_environment () {
    # GITHUB TOKEN to avoid exceed api rate limit
    echo -e "machine api.github.com\n"\
            "    login $GITHUB_TOKEN\n"\
            "    password x-oauth-basic" > /home/vagrant/.netrc
}

set_environment_variables () {
    export NODE_PATH=/vagrant/
}

setup_demo_data () {
    pushd /vagrant/
    node ./bin/dos-db load tag ./lib/fixtures/tags.json
    node ./bin/dos-db load law ./lib/fixtures/laws.json
    popd
}

install_democracyos () {
    pushd /vagrant/
    make clean
    make packages
    setup_demo_data
    #make run
    popd
}

set_environment_variables
configure_environment
install_os_dependencies
install_democracyos

