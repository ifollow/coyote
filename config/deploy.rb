require "rvm/capistrano"
require "bundler/capistrano"

load "config/recipes/base"
load "config/recipes/check"
load "config/recipes/logs"
load "config/recipes/nginx"
load "config/recipes/unicorn"

set :application, "coyote"
server "107.170.116.111", :web, :app, :db, primary: true
set :keep_releases, 2
set :scm, :git
set :repository, 'git@github.com:ifollow/papododia.git'
set :branch, 'master'
set :deploy_via, :remote_cache
set :deploy_to, '/var/www/papododia'
set :current, "#{deploy_to}/current"
set :user, "root"
set :use_sudo, false
set :rvm_ruby_string, 'ruby-2.0.0' # Change to your ruby version

set :rvm_type, :system # :user if RVM installed in $HOME

namespace :deploy do
  # verifica as pasta necessarias para o envio, e inicialização do s serviços
  # para corrigir bug que aconteceu comigo, talvez ja tenham corrigido esse erro
  desc "Creating folders necessary"
  task :check_folders do
    run "if [ ! -d '#{deploy_to}' ];then mkdir #{deploy_to}; fi"
    run "if [ ! -d '#{deploy_to}/#{version_dir}' ];then mkdir #{deploy_to}/#{version_dir}; fi"
    run "if [ ! -d '#{deploy_to}/#{shared_dir}' ];then mkdir #{deploy_to}/#{shared_dir}; fi"
    run "if [ ! -d '#{deploy_to}/#{shared_dir}/pids' ];then mkdir #{deploy_to}/#{shared_dir}/pids; fi"
    run "if [ ! -d '#{deploy_to}/#{shared_dir}/log' ];then mkdir #{deploy_to}/#{shared_dir}/log; fi"
  end

  desc "Instala configurações do Nginx e Unicorn"
  task :setup_config, roles: :app do
    sudo "ln -nfs #{current_path}/config/nginx.conf /etc/nginx/sites-enabled/#{application}"
    sudo "chmod +x #{current_path}/config/unicorn_init.sh"
    sudo "ln -nfs #{current_path}/config/unicorn_init.sh /etc/init.d/unicorn_#{application}"
    sudo "update-rc.d unicorn_papododia defaults"
  end
  after "deploy:setup", "deploy:setup_config"

end
