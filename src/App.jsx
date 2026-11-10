import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, SplitLayout, SplitCol, ScreenSpinner } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { Persik, Home } from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
  const [fetchedUser, setUser] = useState();
  const [popout, setPopout] = useState(<ScreenSpinner />);

useEffect(() => {
async function fetchData() {
  try {
    if (bridge.isEmbedded()) {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
    } else {
      console.log('Приложение запущено вне VK');
    }
  } catch (error) {
    console.error('Не удалось получить данные пользователя VK:', error);
  } finally {
    setPopout(null);
  }
}
  fetchData();
}, []);

  return (
    <SplitLayout>
      <SplitCol>
        <View activePanel={activePanel}>
          <Home id="home" fetchedUser={fetchedUser} />
          <Persik id="persik" />
        </View>
      </SplitCol>
      {popout}
    </SplitLayout>
  );
};
