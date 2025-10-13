import { Layout } from 'antd'
import { APP_DESC, APP_TITLE } from '~/constants/app'

export default function LayoutFooter() {
  return (
    <Layout.Footer className="flex-center">
      {`${APP_TITLE} ©2025 ${APP_DESC}`}
    </Layout.Footer>
  )
}
