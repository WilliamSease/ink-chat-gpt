import os from "os";

const userInfo = os.userInfo();
const username = userInfo.username;
import fs from 'fs';
export const configFolderPath = `/usr/${username}/.config/ink-chat-gpt`;
export const configFilePath = `/usr/${username}/.config/ink-chat-gpt/configfile`;

const ensureExists = () => {
	if (!fs.existsSync(configFolderPath)) {
		fs.mkdirSync(configFolderPath, {recursive:true});
	}
	if (!fs.existsSync(configFilePath)) {
		fs.writeFileSync(configFilePath, '');
	}
};

export const readVariable = (keyToDelete: string): string | undefined => {
	ensureExists();
	let out = undefined;

	const buffer = fs.readFileSync(configFilePath, 'utf8');
	const lines = buffer.split('\n');
	const relevantLines = lines.filter(line =>
		line.startsWith(keyToDelete + '='),
	);
	out = relevantLines[0]?.split('=')[1];
	return out;
};

export const updateVariable = (key: string, value: string): void => {
	ensureExists();
	const buffer = fs.readFileSync(configFilePath, 'utf8');
	const lines = buffer.split('\n');

	let updatedContent = '';
	let found = false;
	for (const line of lines) {
		if (line.startsWith(key + '=')) {
			updatedContent += `${key}=${value}\n`;
			found = true;
		} else {
			updatedContent += line + '\n';
		}
	}

	if (!found) {
		updatedContent += `${key}=${value}\n`;
	}

	fs.writeFileSync(
		configFilePath,
		updatedContent
			.split('\n')
			.filter(line => line !== '')
			.join('\n'),
	);
};

export const deleteVariable = (keyToDelete: string): void => {
	ensureExists();
	const buffer = fs.readFileSync(configFilePath, 'utf8');
	const lines = buffer.split('\n');
	const updatedLines = lines.filter(
		line => !line.startsWith(keyToDelete + '='),
	);
	const updatedContent = updatedLines.join('\n');
	fs.writeFileSync(configFilePath, updatedContent);
};

export const deleteConfigFile = (): void => {
	ensureExists();
	fs.rmSync(configFilePath);
	fs.rmdirSync(configFolderPath);
};
