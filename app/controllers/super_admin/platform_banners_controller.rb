class SuperAdmin::PlatformBannersController < SuperAdmin::ApplicationController
  before_action :ensure_kairos-crm_cloud

  private

  def ensure_kairos-crm_cloud
    raise ActionController::RoutingError, 'Not Found' unless KairosCrmApp.kairos-crm_cloud?
  end
end
