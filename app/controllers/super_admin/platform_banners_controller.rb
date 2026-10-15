class SuperAdmin::PlatformBannersController < SuperAdmin::ApplicationController
  before_action :ensure_kairos_crm_cloud

  private

  def ensure_kairos_crm_cloud
    raise ActionController::RoutingError, 'Not Found' unless KairosCrmApp.kairos_crm_cloud?
  end
end
