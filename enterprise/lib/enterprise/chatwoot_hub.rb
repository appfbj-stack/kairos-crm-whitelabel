module Enterprise::KairosCrmHub
  ENTERPRISE_BASE_URL = 'https://hub.2.kairos-crm.com'.freeze

  def base_url
    return ENV.fetch('KAIROS_CRM_HUB_URL', ENTERPRISE_BASE_URL) if Rails.env.development?

    ENTERPRISE_BASE_URL
  end
end
