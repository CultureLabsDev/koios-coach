
import { Hono, Env } from 'hono';

import * as index from './routes';
import * as admin_index from './routes/admin';
import * as admin_clients_index from './routes/admin/clients';
import * as admin_clients_client_id_index from './routes/admin/clients/[client_id]';
import * as admin_clients_client_id_assistant from './routes/admin/clients/[client_id]/assistant';
import * as admin_clients_client_id_notes from './routes/admin/clients/[client_id]/notes';
import * as admin_clients_client_id_password from './routes/admin/clients/[client_id]/password';
import * as admin_clients_client_id_usage from './routes/admin/clients/[client_id]/usage';
import * as admin_clients_add_user from './routes/admin/clients/add_user';
import * as admin_clients_search from './routes/admin/clients/search';
import * as admin_delegates_index from './routes/admin/delegates';
import * as admin_delegates_delegate_id_index from './routes/admin/delegates/[delegate_id]';
import * as admin_delegates_delegate_id_notes from './routes/admin/delegates/[delegate_id]/notes';
import * as admin_delegates_delegate_id_password from './routes/admin/delegates/[delegate_id]/password';
import * as admin_delegates_delegate_id_reset_mindset from './routes/admin/delegates/[delegate_id]/reset_mindset';
import * as admin_delegates_delegate_id_reset_personality from './routes/admin/delegates/[delegate_id]/reset_personality';
import * as admin_delegates_add_user from './routes/admin/delegates/add_user';
import * as admin_delegates_search from './routes/admin/delegates/search';
import * as admin_settings from './routes/admin/settings';
import * as reset from './routes/reset';
import * as sign_out from './routes/sign_out';
import * as toaster from './routes/toaster';
import * as user_index from './routes/user';
import * as user__websocket from './routes/user/_websocket';
import * as user_mindset_index from './routes/user/mindset';
import * as user_personality_index from './routes/user/personality';
import * as user_personality_assess from './routes/user/personality/assess';

export const loadRoutes = <T extends Env>(app: Hono<T>) => {
	app.get('/', index.onRequestGet);
	app.post('/', index.onRequestPost);
	app.get('/admin', admin_index.onRequestGet);
	app.post('/admin', admin_index.onRequestPost);
	app.patch('/admin', admin_index.onRequestPatch);
	app.get('/admin/clients', admin_clients_index.onRequestGet);
	app.post('/admin/clients', admin_clients_index.onRequestPost);
	app.get('/admin/clients/add_user', admin_clients_add_user.onRequestGet);
	app.post('/admin/clients/add_user', admin_clients_add_user.onRequestPost);
	app.post('/admin/clients/search', admin_clients_search.onRequestPost);
	app.get('/admin/clients/:client_id', admin_clients_client_id_index.onRequestGet);
	app.put('/admin/clients/:client_id', admin_clients_client_id_index.onRequestPut);
	app.post('/admin/clients/:client_id', admin_clients_client_id_index.onRequestPost);
	app.delete('/admin/clients/:client_id', admin_clients_client_id_index.onRequestDelete);
	app.patch('/admin/clients/:client_id', admin_clients_client_id_index.onRequestPatch);
	app.get('/admin/clients/:client_id/assistant', admin_clients_client_id_assistant.onRequestGet);
	app.put('/admin/clients/:client_id/assistant', admin_clients_client_id_assistant.onRequestPut);
	app.post('/admin/clients/:client_id/assistant', admin_clients_client_id_assistant.onRequestPost);
	app.delete('/admin/clients/:client_id/assistant', admin_clients_client_id_assistant.onRequestDelete);
	app.post('/admin/clients/:client_id/notes', admin_clients_client_id_notes.onRequestPost);
	app.post('/admin/clients/:client_id/password', admin_clients_client_id_password.onRequestPost);
	app.patch('/admin/clients/:client_id/usage', admin_clients_client_id_usage.onRequestPatch);
	app.get('/admin/delegates', admin_delegates_index.onRequestGet);
	app.post('/admin/delegates', admin_delegates_index.onRequestPost);
	app.get('/admin/delegates/add_user', admin_delegates_add_user.onRequestGet);
	app.post('/admin/delegates/add_user', admin_delegates_add_user.onRequestPost);
	app.post('/admin/delegates/search', admin_delegates_search.onRequestPost);
	app.get('/admin/delegates/:delegate_id', admin_delegates_delegate_id_index.onRequestGet);
	app.put('/admin/delegates/:delegate_id', admin_delegates_delegate_id_index.onRequestPut);
	app.post('/admin/delegates/:delegate_id', admin_delegates_delegate_id_index.onRequestPost);
	app.delete('/admin/delegates/:delegate_id', admin_delegates_delegate_id_index.onRequestDelete);
	app.patch('/admin/delegates/:delegate_id', admin_delegates_delegate_id_index.onRequestPatch);
	app.post('/admin/delegates/:delegate_id/notes', admin_delegates_delegate_id_notes.onRequestPost);
	app.post('/admin/delegates/:delegate_id/password', admin_delegates_delegate_id_password.onRequestPost);
	app.post('/admin/delegates/:delegate_id/reset_mindset', admin_delegates_delegate_id_reset_mindset.onRequestPost);
	app.post('/admin/delegates/:delegate_id/reset_personality', admin_delegates_delegate_id_reset_personality.onRequestPost);
	app.get('/admin/settings', admin_settings.onRequestGet);
	app.get('/reset', reset.onRequestGet);
	app.post('/reset', reset.onRequestPost);
	app.get('/sign_out', sign_out.onRequestGet);
	app.post('/toaster', toaster.onRequestPost);
	app.get('/user', user_index.onRequestGet);
	app.put('/user', user_index.onRequestPut);
	app.post('/user', user_index.onRequestPost);
	app.delete('/user', user_index.onRequestDelete);
	app.get('/user/_websocket', user__websocket.onRequestGet);
	app.get('/user/mindset', user_mindset_index.onRequestGet);
	app.put('/user/mindset', user_mindset_index.onRequestPut);
	app.post('/user/mindset', user_mindset_index.onRequestPost);
	app.get('/user/personality', user_personality_index.onRequestGet);
	app.post('/user/personality', user_personality_index.onRequestPost);
	app.patch('/user/personality', user_personality_index.onRequestPatch);
	app.put('/user/personality/assess', user_personality_assess.onRequestPut);
	app.post('/user/personality/assess', user_personality_assess.onRequestPost);
	app.delete('/user/personality/assess', user_personality_assess.onRequestDelete);
};