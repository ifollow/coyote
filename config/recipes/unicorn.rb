set_default(:unicorn_user) { user }
set_default(:unicorn_pid) { "#{current_path}/tmp/pids/unicorn.pid" }
set_default(:unicorn_config) { "#{shared_path}/config/unicorn.rb" }
set_default(:unicorn_log) { "#{shared_path}/log/unicorn.log" }
set_default(:unicorn_workers, 2)

namespace :unicorn do

  %w[start stop].each do |command|
    desc "#{command} unicorn"
    task command, roles: :app do
      run "#{current_path}/config/unicorn_init.sh #{command}"
    end
    after "deploy:#{command}", "unicorn:#{command}"
  end

  desc "Restart unicorn"
  task :restart, roles: :app do
    stop
    sleep 4
    start
  end
  # after "deploy:restart", "unicorn:restart"

  desc "Get ouput of unicorn log file"
  task :tail do
    stream "tail -n 300 -f #{unicorn_log}"
  end
end
