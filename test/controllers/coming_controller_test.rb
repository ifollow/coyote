require 'test_helper'

class ComingControllerTest < ActionController::TestCase
  test "should get soon" do
    get :soon
    assert_response :success
  end

end
