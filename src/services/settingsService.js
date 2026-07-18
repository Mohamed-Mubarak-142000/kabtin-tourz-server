const Settings = require('../models/Settings');

async function getSettings() {
  let settings = await Settings.findById(Settings.SINGLETON_ID);
  if (!settings) {
    // Return an empty-but-valid singleton if none has been seeded yet,
    // without persisting it (PUT is what actually creates/updates it).
    settings = new Settings({ _id: Settings.SINGLETON_ID });
  }
  return settings;
}

// Full upsert of the singleton settings document.
async function updateSettings(payload) {
  const settings = await Settings.findByIdAndUpdate(
    Settings.SINGLETON_ID,
    { $set: payload },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  return settings;
}

module.exports = { getSettings, updateSettings };
