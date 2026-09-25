import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../data/mock_data.dart';
import '../../providers/app_state.dart';
import '../../theme/app_colors.dart';
import '../../utils/elevation.dart';
import '../../widgets/layout_metrics.dart';
import '../../widgets/ai_message_bubble.dart';
import '../../widgets/ambient_background.dart';
import '../../widgets/app_text.dart';

class DurgaScreen extends StatefulWidget {
  const DurgaScreen({super.key});

  @override
  State<DurgaScreen> createState() => _DurgaScreenState();
}

class _DurgaScreenState extends State<DurgaScreen> {
  final _textController = TextEditingController();
  final _scrollController = ScrollController();

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToEnd() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scrollController.hasClients) return;
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
      );
    });
  }

  void _onAction(BuildContext context, AppState app, String id) {
    if (id == 'sos' || id == 'call' || id == 'alert') {
      app.startEmergency();
      context.push('/emergency');
    } else if (id == 'share' || id == 'share-all') {
      app.setLocationSharing(true);
    } else if (id == 'nav-police' || id == 'help') {
      context.push('/nearby-help');
    } else if (id == 'safe-place' || id == 'safest' || id == 'fastest') {
      context.go('/map');
    }
  }

  void _submit([String? value]) {
    final app = context.read<AppState>();
    final next = (value ?? _textController.text).trim();
    if (next.isEmpty || app.isTyping) return;
    app.sendMessage(next);
    _textController.clear();
    _scrollToEnd();
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final insets = MediaQuery.paddingOf(context);
    final bottomPad = bottomChromeHeight(true, insets.bottom);
    final canSend = _textController.text.trim().isNotEmpty && !app.isTyping;

    _scrollToEnd();

    return Scaffold(
      backgroundColor: AppColors.cream,
      body: Stack(
        fit: StackFit.expand,
        children: [
          const AmbientBackground(),
          Column(
            children: [
              Padding(
                padding: EdgeInsets.fromLTRB(16, insets.top + 6, 16, 8),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppColors.line),
                    boxShadow: softShadow(),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 42,
                        height: 42,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(14),
                          gradient: const LinearGradient(
                            colors: [AppColors.maroon, Color(0xFFA13F3C)],
                          ),
                        ),
                        child: const Icon(LucideIcons.shield, size: 18, color: Colors.white),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const AppText(
                              'DURGA AI',
                              weight: AppFontWeight.extraBold,
                              fontSize: 18,
                              color: AppColors.ink,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: AppColors.safe,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                AppText(
                                  app.isTyping ? 'Responding…' : 'Safety monitoring active',
                                  fontSize: 12,
                                  color: AppColors.safe,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Expanded(
                child: ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
                  itemCount: app.messages.length + (app.isTyping ? 1 : 0),
                  itemBuilder: (context, index) {
                    if (index < app.messages.length) {
                      return AIMessageBubble(
                        message: app.messages[index],
                        onAction: (id) => _onAction(context, app, id),
                      );
                    }
                    return const TypingBubble();
                  },
                ),
              ),
              Container(
                decoration: const BoxDecoration(
                  color: AppColors.cream,
                  border: Border(top: BorderSide(color: AppColors.line, width: 0.5)),
                ),
                padding: EdgeInsets.only(top: 8, bottom: bottomPad),
                child: Column(
                  children: [
                    SizedBox(
                      height: 40,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: quickPrompts.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 8),
                        itemBuilder: (context, index) {
                          final item = quickPrompts[index];
                          return GestureDetector(
                            onTap: app.isTyping ? null : () => _submit(item),
                            child: Opacity(
                              opacity: app.isTyping ? 0.55 : 1,
                              child: Container(
                                constraints: const BoxConstraints(maxWidth: 220),
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(999),
                                  border: Border.all(color: AppColors.line),
                                ),
                                alignment: Alignment.center,
                                child: AppText(
                                  item,
                                  weight: AppFontWeight.semibold,
                                  fontSize: 12,
                                  color: AppColors.maroon,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 10),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Container(
                        constraints: const BoxConstraints(minHeight: 56),
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(22),
                          border: Border.all(color: AppColors.line),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            GestureDetector(
                              onTap: () {
                                showDialog<void>(
                                  context: context,
                                  builder: (ctx) => AlertDialog(
                                    title: const Text('Voice'),
                                    content: const Text(
                                      'Voice input is mocked in this demo. Tap a prompt or type instead.',
                                    ),
                                    actions: [
                                      TextButton(
                                        onPressed: () => Navigator.pop(ctx),
                                        child: const Text('OK'),
                                      ),
                                    ],
                                  ),
                                );
                              },
                              child: Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: AppColors.maroon,
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: const Icon(LucideIcons.mic, size: 18, color: Colors.white),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: TextField(
                                controller: _textController,
                                enabled: !app.isTyping,
                                maxLength: 500,
                                maxLines: 4,
                                minLines: 1,
                                onChanged: (_) => setState(() {}),
                                onSubmitted: (_) => _submit(),
                                style: const TextStyle(color: AppColors.ink, fontSize: 15, height: 20 / 15),
                                decoration: const InputDecoration(
                                  hintText: 'Tell DURGA how you feel…',
                                  hintStyle: TextStyle(color: AppColors.muted),
                                  border: InputBorder.none,
                                  counterText: '',
                                  isDense: true,
                                  contentPadding: EdgeInsets.symmetric(horizontal: 4, vertical: 10),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            GestureDetector(
                              onTap: canSend ? () => _submit() : null,
                              child: Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: canSend ? AppColors.maroon : AppColors.creamDeep,
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: Icon(
                                  LucideIcons.send,
                                  size: 16,
                                  color: canSend ? Colors.white : AppColors.muted,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
